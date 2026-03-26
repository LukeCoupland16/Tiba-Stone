#!/usr/bin/env python3
"""
scrape-slab-specs.py — Scrape thickness and dimensions from Emporium Marble
detail pages, then update slab-name-mapping.csv and js/slabs-data.js.

Usage:
    python scripts/scrape-slab-specs.py
    python scripts/scrape-slab-specs.py --dry-run
    python scripts/scrape-slab-specs.py --workers 2
"""

import argparse
import csv
import html as html_mod
import json
import logging
import os
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from threading import Lock

try:
    import requests
except ImportError:
    sys.exit("Missing dependency: pip install requests")

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = PROJECT_ROOT / "slab-name-mapping.csv"
JS_PATH = PROJECT_ROOT / "js" / "slabs-data.js"

BASE_URL = "https://www.emporium-marble.com"
DETAIL_URL = f"{BASE_URL}/products-detail"

DELAY_SECONDS = 0.4
DEFAULT_WORKERS = 4

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/125.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html",
    "Referer": BASE_URL,
}

_lock = Lock()
_last_time = 0.0


def polite_delay():
    global _last_time
    with _lock:
        now = time.monotonic()
        wait = DELAY_SECONDS - (now - _last_time)
        if wait > 0:
            time.sleep(wait)
        _last_time = time.monotonic()


# ---------------------------------------------------------------------------
# Scraping
# ---------------------------------------------------------------------------

def scrape_specs(emporium_id, original_name, session):
    """Fetch a detail page and extract thickness + dimensions."""
    slug = original_name.lower().replace(" ", "-").replace("'", "")
    url = f"{DETAIL_URL}/{emporium_id}/{slug}"

    polite_delay()
    try:
        resp = session.get(url, headers=HEADERS, timeout=30)
        if resp.status_code != 200:
            return None, None, url
        html = resp.text
    except requests.RequestException:
        return None, None, url

    thickness = None
    dimensions = None

    # Look for thickness — patterns like "± 2cm", "± 2 cm", "2cm", "3cm"
    t_match = re.search(
        r'(?:thickness|dikte)[^<]*?[:\s]+([\s\S]{0,60}?(?:\d[\d.,]*\s*cm))',
        html, re.IGNORECASE
    )
    if t_match:
        thickness = t_match.group(1).strip()
        # Clean up
        thickness = re.sub(r'\s+', ' ', thickness)
        thickness = re.sub(r'<[^>]+>', '', thickness)
        thickness = thickness.strip(' :')
    else:
        # Broader search for standalone thickness values
        t_match2 = re.search(r'[±+\-/]*\s*(\d[\d.,]*)\s*cm\b', html)
        if t_match2:
            raw = t_match2.group(0).strip()
            # Only use if it looks like a thickness (small number)
            num = re.search(r'(\d[\d.,]*)', raw)
            if num:
                val = float(num.group(1).replace(',', '.'))
                if val <= 10:
                    thickness = raw

    # Look for dimensions — patterns like "Uk : +/- 318 x 199cm", "± 2,880 x 1,540"
    d_match = re.search(
        r'(?:Uk\s*:\s*|maat\s*:\s*|dimensions?\s*:\s*)([\s\S]{0,80}?(?:\d[\d.,]*\s*x\s*\d[\d.,]*)\s*(?:cm)?)',
        html, re.IGNORECASE
    )
    if d_match:
        dimensions = d_match.group(1).strip()
        dimensions = re.sub(r'\s+', ' ', dimensions)
        dimensions = re.sub(r'<[^>]+>', '', dimensions)
        dimensions = dimensions.strip(' :')
    else:
        # Broader: look for NxN patterns that look like slab dimensions
        d_match2 = re.search(
            r'[±+\-/]*\s*(\d[\d.,]+)\s*x\s*(\d[\d.,]+)\s*(?:cm)?',
            html, re.IGNORECASE
        )
        if d_match2:
            w = d_match2.group(1).replace(',', '')
            h = d_match2.group(2).replace(',', '')
            try:
                wn, hn = float(w), float(h)
                # Only accept if it looks like slab dimensions (> 50cm)
                if wn > 50 and hn > 50:
                    dimensions = d_match2.group(0).strip()
            except ValueError:
                pass

    # Decode HTML entities and clean up
    if thickness:
        thickness = html_mod.unescape(thickness).strip()
        thickness = re.sub(r'\s+', ' ', thickness)
    if dimensions:
        dimensions = html_mod.unescape(dimensions).strip()
        dimensions = re.sub(r'\s+', ' ', dimensions)
        # Normalise: remove "Uk :" prefix, add "cm" if missing
        dimensions = re.sub(r'^[Uu]k\s*:\s*', '', dimensions).strip()
        if 'cm' not in dimensions.lower():
            dimensions = dimensions + ' cm'

    return thickness, dimensions, url


# ---------------------------------------------------------------------------
# CSV I/O
# ---------------------------------------------------------------------------

def load_csv(path):
    rows = []
    with open(path, newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        fieldnames = reader.fieldnames
        for row in reader:
            rows.append(row)
    return fieldnames, rows


def save_csv(path, fieldnames, rows):
    with open(path, "w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


# ---------------------------------------------------------------------------
# JS generation
# ---------------------------------------------------------------------------

COLOR_MAP = {
    'white': 'White', 'black': 'Black', 'beige': 'Beige', 'grey': 'Grey',
    'gray': 'Grey', 'red': 'Red', 'blue': 'Blue', 'brown': 'Brown',
    'yellow': 'Yellow', 'green': 'Green', 'multicolour': 'Multicolour',
    'multi': 'Multicolour', 'pink': 'Red', 'gold': 'Yellow',
    'cream': 'Beige', 'ivory': 'White', 'silver': 'Grey',
}


def guess_color(name):
    """Very rough color guess from slab name — not used if CSV has color."""
    name_lower = name.lower()
    for key, val in COLOR_MAP.items():
        if key in name_lower:
            return val
    return 'Beige'


def load_existing_js(js_path):
    """Read existing slabs-data.js and return a dict keyed by slug."""
    if not js_path.exists():
        return {}
    text = js_path.read_text(encoding="utf-8")
    # Extract JSON array from "window.SLABS_DATA = [...];"
    match = re.search(r'window\.SLABS_DATA\s*=\s*(\[[\s\S]*\])\s*;', text)
    if not match:
        return {}
    try:
        arr = json.loads(match.group(1))
        return {s['slug']: s for s in arr if 'slug' in s}
    except (json.JSONDecodeError, KeyError):
        return {}


def regenerate_js(csv_rows, js_path):
    """Write js/slabs-data.js from CSV rows, preserving color from existing JS."""
    existing = load_existing_js(js_path)

    slabs = []
    for row in csv_rows:
        slug = row.get('tiba_slug', '').strip()
        cat = row.get('category', '').strip()
        if not slug or not cat:
            continue

        # Preserve color from existing JS data
        existing_slab = existing.get(slug, {})
        color = existing_slab.get('color', '')

        slab = {
            'id': int(row.get('emporium_id', 0) or 0),
            'name': row.get('tiba_name', '').strip(),
            'slug': slug,
            'category': cat.lower(),
            'color': color,
            'image': f"Slabs/{cat.lower()}/{slug}.webp",
            'material': row.get('material', '').strip(),
            'origin': row.get('origin', '').strip(),
            'dimensions': row.get('dimensions', '').strip(),
            'thickness': row.get('thickness', '').strip(),
            'description': row.get('description', '').strip(),
        }
        slabs.append(slab)

    js_content = "window.SLABS_DATA = " + json.dumps(slabs, indent=2, ensure_ascii=False) + ";\n"
    js_path.parent.mkdir(parents=True, exist_ok=True)
    with open(js_path, "w", encoding="utf-8") as fh:
        fh.write(js_content)

    return len(slabs)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Scrape slab specs from Emporium Marble.")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--workers", type=int, default=DEFAULT_WORKERS)
    parser.add_argument("-v", "--verbose", action="store_true")
    args = parser.parse_args()

    level = logging.DEBUG if args.verbose else logging.INFO
    logging.basicConfig(level=level, format="%(asctime)s  %(levelname)-7s  %(message)s", datefmt="%H:%M:%S")

    fieldnames, rows = load_csv(CSV_PATH)

    # Ensure columns exist
    if 'dimensions' not in fieldnames:
        fieldnames.append('dimensions')
    if 'thickness' not in fieldnames:
        fieldnames.append('thickness')

    # Filter to rows that need specs
    to_scrape = []
    for i, row in enumerate(rows):
        eid = row.get('emporium_id', '').strip()
        has_thickness = row.get('thickness', '').strip()
        has_dims = row.get('dimensions', '').strip()
        if eid and (not has_thickness or not has_dims):
            to_scrape.append((i, row))

    print(f"\n{'=' * 60}")
    print(f"  Tiba Stone — Slab Spec Scraper")
    print(f"{'=' * 60}")
    print(f"  Total slabs in CSV:  {len(rows)}")
    print(f"  Need scraping:       {len(to_scrape)}")
    print(f"  Workers:             {args.workers}")
    if args.dry_run:
        print(f"  Mode:                DRY RUN")
    print(f"{'=' * 60}\n")

    if not to_scrape:
        print("All slabs already have specs. Nothing to do.")
        return

    session = requests.Session()
    updated = 0
    failed = 0
    lock = Lock()

    def process_one(item):
        nonlocal updated, failed
        idx, row = item
        eid = row['emporium_id'].strip()
        orig = row.get('original_name', '').strip()
        tiba = row.get('tiba_name', '').strip()

        thickness, dimensions, url = scrape_specs(eid, orig, session)

        with lock:
            if thickness or dimensions:
                if thickness and not row.get('thickness', '').strip():
                    rows[idx]['thickness'] = thickness
                if dimensions and not row.get('dimensions', '').strip():
                    rows[idx]['dimensions'] = dimensions
                updated += 1
                logging.info("OK: %s — thickness=%s, dims=%s", tiba, thickness or '(none)', dimensions or '(none)')
            else:
                failed += 1
                logging.warning("MISS: %s — no specs found at %s", tiba, url)

    if args.dry_run:
        for idx, row in to_scrape[:5]:
            eid = row['emporium_id'].strip()
            orig = row.get('original_name', '').strip()
            tiba = row.get('tiba_name', '').strip()
            thickness, dimensions, url = scrape_specs(eid, orig, session)
            print(f"  {tiba}: thickness={thickness}, dims={dimensions}")
            print(f"    URL: {url}")
        print(f"\n  (showing first 5 of {len(to_scrape)})")
        return

    if args.workers <= 1:
        for item in to_scrape:
            process_one(item)
    else:
        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            futures = {pool.submit(process_one, item): item for item in to_scrape}
            for future in as_completed(futures):
                try:
                    future.result()
                except Exception as exc:
                    logging.error("Exception: %s", exc)

    print(f"\n{'=' * 60}")
    print(f"  SUMMARY")
    print(f"{'=' * 60}")
    print(f"  Updated:  {updated}")
    print(f"  Missed:   {failed}")
    print(f"{'=' * 60}\n")

    # Save CSV
    save_csv(CSV_PATH, fieldnames, rows)
    print(f"  CSV saved: {CSV_PATH}")

    # Regenerate JS
    count = regenerate_js(rows, JS_PATH)
    print(f"  JS saved:  {JS_PATH} ({count} slabs)")


if __name__ == "__main__":
    main()
