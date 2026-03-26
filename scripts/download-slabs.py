#!/usr/bin/env python3
"""
download-slabs.py — Download slab images from Emporium Marble, crop watermarks,
convert to WebP, and save to the Slabs/ directory tree.

Reads slab-name-mapping.csv from the project root and saves processed images
to Slabs/{category}/{tiba_slug}.webp.

Usage:
    python scripts/download-slabs.py                   # download all
    python scripts/download-slabs.py --dry-run         # preview without downloading
    python scripts/download-slabs.py --category marble # download only marble
    python scripts/download-slabs.py --workers 1       # single-threaded (slower, politer)

Requirements:
    pip install requests Pillow
"""

import argparse
import csv
import io
import logging
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field
from pathlib import Path
from threading import Lock
from typing import Optional

try:
    import requests
except ImportError:
    sys.exit("Missing dependency: pip install requests")

try:
    from PIL import Image
except ImportError:
    sys.exit("Missing dependency: pip install Pillow")


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = PROJECT_ROOT / "slab-name-mapping.csv"
SLABS_DIR = PROJECT_ROOT / "Slabs"

BASE_URL = "https://www.emporium-marble.com"
CROP_URL_PRIMARY = f"{BASE_URL}/upload/crop770-524_"
CROP_URL_FALLBACK = f"{BASE_URL}/upload/crop370-247_"
DETAIL_URL = f"{BASE_URL}/products-detail"

WATERMARK_CROP_PX = 35       # pixels to trim from the bottom
WEBP_QUALITY = 85
MIN_IMAGE_SIZE = (50, 50)    # reject images smaller than this
DELAY_SECONDS = 0.5          # pause between requests
DEFAULT_WORKERS = 4

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/125.0.0.0 Safari/537.36"
    ),
    "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
    "Referer": BASE_URL,
}

# Thread-safe delay so parallel workers don't hammer the server
_last_request_lock = Lock()
_last_request_time = 0.0


def polite_delay():
    """Enforce a minimum gap between HTTP requests across all threads."""
    global _last_request_time
    with _last_request_lock:
        now = time.monotonic()
        wait = DELAY_SECONDS - (now - _last_request_time)
        if wait > 0:
            time.sleep(wait)
        _last_request_time = time.monotonic()


# ---------------------------------------------------------------------------
# Data model
# ---------------------------------------------------------------------------

@dataclass
class SlabRow:
    original_name: str = ""
    tiba_name: str = ""
    tiba_slug: str = ""
    category: str = ""
    emporium_id: str = ""
    image_filename: str = ""
    material: str = ""
    origin: str = ""
    dimensions: str = ""
    thickness: str = ""
    description: str = ""


@dataclass
class Report:
    downloaded: int = 0
    failed: int = 0
    skipped: int = 0
    failures: list = field(default_factory=list)
    lock: Lock = field(default_factory=Lock, repr=False)

    def record_download(self):
        with self.lock:
            self.downloaded += 1

    def record_fail(self, name: str, reason: str):
        with self.lock:
            self.failed += 1
            self.failures.append((name, reason))

    def record_skip(self):
        with self.lock:
            self.skipped += 1


# ---------------------------------------------------------------------------
# Image helpers
# ---------------------------------------------------------------------------

def fetch_image(url: str, session: requests.Session) -> Optional[bytes]:
    """Download an image, returning raw bytes or None on failure."""
    polite_delay()
    try:
        resp = session.get(url, headers=HEADERS, timeout=30)
        if resp.status_code == 404:
            return None
        resp.raise_for_status()
        # Quick sanity check — should look like an image
        content_type = resp.headers.get("Content-Type", "")
        if "image" not in content_type and len(resp.content) < 1000:
            return None
        return resp.content
    except requests.RequestException as exc:
        logging.debug("Request failed for %s: %s", url, exc)
        return None


def process_image(raw_bytes: bytes) -> Optional[Image.Image]:
    """Open image bytes, validate size, crop watermark, return PIL Image."""
    try:
        img = Image.open(io.BytesIO(raw_bytes))
        img.load()  # force decode
    except Exception as exc:
        logging.debug("Cannot open image: %s", exc)
        return None

    w, h = img.size
    if w < MIN_IMAGE_SIZE[0] or h < MIN_IMAGE_SIZE[1]:
        logging.debug("Image too small: %dx%d", w, h)
        return None

    # Crop the bottom watermark strip
    crop_px = min(WATERMARK_CROP_PX, h // 4)  # never crop more than 25%
    if crop_px > 0:
        img = img.crop((0, 0, w, h - crop_px))

    # Convert to RGB if necessary (e.g. RGBA, palette)
    if img.mode not in ("RGB", "L"):
        img = img.convert("RGB")

    return img


def save_webp(img: Image.Image, dest: Path) -> None:
    """Save a PIL Image as WebP at the configured quality."""
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(str(dest), format="WEBP", quality=WEBP_QUALITY, method=4)


# ---------------------------------------------------------------------------
# Scraper for detail pages (fallback when no image_filename)
# ---------------------------------------------------------------------------

def scrape_detail_image_url(emporium_id: str, slug: str, session: requests.Session) -> Optional[str]:
    """Try to find an image URL from the product detail page."""
    if not emporium_id or not slug:
        return None

    url = f"{DETAIL_URL}/{emporium_id}/{slug}"
    polite_delay()

    try:
        resp = session.get(url, headers={**HEADERS, "Accept": "text/html"}, timeout=30)
        if resp.status_code != 200:
            return None

        html = resp.text

        # Look for common image patterns in the page.
        # Emporium typically uses /upload/ paths for product images.
        import re
        # Try to find a large crop image first
        patterns = [
            r'src=["\']([^"\']*?/upload/crop770-524_[^"\']+)["\']',
            r'src=["\']([^"\']*?/upload/crop370-247_[^"\']+)["\']',
            r'src=["\']([^"\']*?/upload/[^"\']+\.(?:jpg|jpeg|png|webp))["\']',
            r'data-src=["\']([^"\']*?/upload/[^"\']+\.(?:jpg|jpeg|png|webp))["\']',
        ]

        for pattern in patterns:
            match = re.search(pattern, html, re.IGNORECASE)
            if match:
                img_url = match.group(1)
                # Make absolute if relative
                if img_url.startswith("/"):
                    img_url = BASE_URL + img_url
                elif not img_url.startswith("http"):
                    img_url = BASE_URL + "/" + img_url
                return img_url

    except requests.RequestException as exc:
        logging.debug("Detail page scrape failed for %s: %s", url, exc)

    return None


# ---------------------------------------------------------------------------
# Per-stone download logic
# ---------------------------------------------------------------------------

def download_slab(row: SlabRow, session: requests.Session, report: Report,
                  dry_run: bool = False) -> None:
    """Download, process, and save one slab image."""

    dest = SLABS_DIR / row.category / f"{row.tiba_slug}.webp"
    label = f"{row.tiba_name} ({row.category}/{row.tiba_slug})"

    # --- Stones WITH an image_filename ---
    if row.image_filename.strip():
        url_primary = CROP_URL_PRIMARY + row.image_filename
        url_fallback = CROP_URL_FALLBACK + row.image_filename

        if dry_run:
            print(f"  [DRY RUN] Would download: {url_primary}")
            print(f"            Fallback:       {url_fallback}")
            print(f"            Save to:        {dest}")
            return

        # Try primary resolution
        raw = fetch_image(url_primary, session)
        source_url = url_primary

        # Fall back to smaller resolution
        if raw is None:
            logging.info("Primary URL failed for %s, trying fallback...", label)
            raw = fetch_image(url_fallback, session)
            source_url = url_fallback

        if raw is None:
            report.record_fail(label, "Both image URLs returned errors")
            logging.warning("FAILED: %s — could not download from either URL", label)
            return

        img = process_image(raw)
        if img is None:
            report.record_fail(label, "Image invalid or too small")
            logging.warning("FAILED: %s — image could not be processed", label)
            return

        save_webp(img, dest)
        report.record_download()
        logging.info("OK: %s — saved %s (%dx%d)", label, dest.name, img.size[0], img.size[1])
        return

    # --- Stones WITHOUT an image_filename — try scraping detail page ---
    if not row.emporium_id.strip():
        if dry_run:
            print(f"  [DRY RUN] SKIP (no image_filename, no emporium_id): {label}")
        else:
            report.record_skip()
            logging.info("SKIP: %s — no image_filename and no emporium_id", label)
        return

    # Build a slug for the detail URL from the original name
    detail_slug = row.original_name.lower().replace(" ", "-").replace("'", "")

    if dry_run:
        detail_url = f"{DETAIL_URL}/{row.emporium_id}/{detail_slug}"
        print(f"  [DRY RUN] Would scrape detail page: {detail_url}")
        print(f"            Save to: {dest}")
        return

    scraped_url = scrape_detail_image_url(row.emporium_id, detail_slug, session)
    if scraped_url is None:
        report.record_fail(label, "Could not find image on detail page")
        logging.warning("FAILED: %s — detail page scrape found no image", label)
        return

    raw = fetch_image(scraped_url, session)
    if raw is None:
        report.record_fail(label, f"Scraped URL returned error: {scraped_url}")
        logging.warning("FAILED: %s — scraped URL failed: %s", label, scraped_url)
        return

    img = process_image(raw)
    if img is None:
        report.record_fail(label, "Scraped image invalid or too small")
        logging.warning("FAILED: %s — scraped image could not be processed", label)
        return

    save_webp(img, dest)
    report.record_download()
    logging.info("OK: %s — saved %s (%dx%d) [scraped]", label, dest.name, img.size[0], img.size[1])


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def load_csv(path: Path, category_filter: Optional[str] = None) -> list[SlabRow]:
    """Read the CSV and return a list of SlabRow objects."""
    if not path.exists():
        sys.exit(f"CSV not found: {path}")

    rows = []
    with open(path, newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        for raw in reader:
            row = SlabRow(
                original_name=raw.get("original_name", "").strip(),
                tiba_name=raw.get("tiba_name", "").strip(),
                tiba_slug=raw.get("tiba_slug", "").strip(),
                category=raw.get("category", "").strip(),
                emporium_id=raw.get("emporium_id", "").strip(),
                image_filename=raw.get("image_filename", "").strip(),
                material=raw.get("material", "").strip(),
                origin=raw.get("origin", "").strip(),
                dimensions=raw.get("dimensions", "").strip(),
                thickness=raw.get("thickness", "").strip(),
                description=raw.get("description", "").strip(),
            )
            # Skip rows without essential fields
            if not row.tiba_slug or not row.category:
                logging.debug("Skipping row with missing slug/category: %s", raw)
                continue

            if category_filter and row.category.lower() != category_filter.lower():
                continue

            rows.append(row)

    return rows


def main():
    parser = argparse.ArgumentParser(
        description="Download slab images from Emporium Marble, crop watermarks, convert to WebP."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print what would be downloaded without actually downloading.",
    )
    parser.add_argument(
        "--category",
        type=str,
        default=None,
        help="Only download slabs in this category (e.g. 'marble', 'onyx').",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=DEFAULT_WORKERS,
        help=f"Number of parallel download threads (default: {DEFAULT_WORKERS}). Use 1 for sequential.",
    )
    parser.add_argument(
        "--csv",
        type=str,
        default=str(CSV_PATH),
        help=f"Path to the CSV file (default: {CSV_PATH}).",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Enable debug logging.",
    )
    args = parser.parse_args()

    # Set up logging
    level = logging.DEBUG if args.verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(asctime)s  %(levelname)-7s  %(message)s",
        datefmt="%H:%M:%S",
    )

    csv_path = Path(args.csv)
    rows = load_csv(csv_path, args.category)

    if not rows:
        print("No matching rows found in CSV.")
        return

    print(f"\n{'=' * 60}")
    print(f"  Tiba Stone — Slab Image Downloader")
    print(f"{'=' * 60}")
    print(f"  CSV:        {csv_path}")
    print(f"  Output:     {SLABS_DIR}")
    print(f"  Stones:     {len(rows)}")
    print(f"  Workers:    {args.workers}")
    if args.category:
        print(f"  Category:   {args.category}")
    if args.dry_run:
        print(f"  Mode:       DRY RUN")
    print(f"{'=' * 60}\n")

    report = Report()
    session = requests.Session()

    if args.dry_run:
        # Dry run: just iterate sequentially
        for row in rows:
            download_slab(row, session, report, dry_run=True)
        print(f"\nDry run complete. {len(rows)} stones would be processed.")
        return

    # Parallel or sequential download
    if args.workers <= 1:
        for row in rows:
            download_slab(row, session, report)
    else:
        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            futures = {
                pool.submit(download_slab, row, session, report): row
                for row in rows
            }
            for future in as_completed(futures):
                row = futures[future]
                try:
                    future.result()
                except Exception as exc:
                    label = f"{row.tiba_name} ({row.category}/{row.tiba_slug})"
                    report.record_fail(label, f"Unhandled exception: {exc}")
                    logging.error("EXCEPTION processing %s: %s", label, exc)

    # Print summary
    print(f"\n{'=' * 60}")
    print(f"  SUMMARY")
    print(f"{'=' * 60}")
    print(f"  Downloaded:  {report.downloaded}")
    print(f"  Failed:      {report.failed}")
    print(f"  Skipped:     {report.skipped}")
    print(f"  Total:       {report.downloaded + report.failed + report.skipped}")
    print(f"{'=' * 60}")

    if report.failures:
        print(f"\n  Failed stones:")
        for name, reason in report.failures:
            print(f"    - {name}: {reason}")
        print()

    # Exit with non-zero if any failures
    if report.failed > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
