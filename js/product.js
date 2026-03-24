/* ============================================
   TIBA STONE — PRODUCT PAGE JAVASCRIPT
   Hero thumbnail switcher, material swatch
   selector, FAQ accordion, inquiry form,
   progressive image fade
============================================ */
(function () {
  'use strict';

  /* Image arrays set per-page via window.HERO_IMAGES / window.INQUIRY_IMAGES */
  var heroImages = window.HERO_IMAGES || [];
  var inquiryImages = window.INQUIRY_IMAGES || [];

  /* ---- Hero image thumbnail switcher ---- */
  var heroMainImg = document.getElementById('heroMainImg');
  var heroThumbs = document.querySelectorAll('.product-hero__info .hero-thumb');

  if (heroMainImg && heroThumbs.length) {
    heroThumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        heroThumbs.forEach(function (t) { t.classList.remove('is-active'); });
        this.classList.add('is-active');

        var nameEl = document.getElementById('selectedStoneName');
        if (nameEl) {
          nameEl.style.opacity = '0';
          nameEl.style.transition = 'opacity 0.25s ease';
          var self = this;
          setTimeout(function () {
            var swatchName = self.querySelector('.swatch__name');
            if (swatchName) nameEl.textContent = swatchName.textContent;
            nameEl.style.opacity = '1';
          }, 150);
        }

        var idx = parseInt(this.dataset.index, 10);
        if (heroImages[idx]) {
          heroMainImg.style.opacity = '0';
          setTimeout(function () {
            heroMainImg.src = heroImages[idx];
            heroMainImg.onload = function () { heroMainImg.style.opacity = '1'; };
          }, 200);
        }
      });
    });
  }

  /* ---- Inquiry image thumbnail switcher ---- */
  var inquiryPreviewImg = document.getElementById('inquiryPreviewImg');
  var inquiryThumbs = document.querySelectorAll('.inquiry__thumbs .hero-thumb');

  if (inquiryPreviewImg && inquiryThumbs.length) {
    inquiryThumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        inquiryThumbs.forEach(function (t) { t.classList.remove('is-active'); });
        this.classList.add('is-active');
        var idx = parseInt(this.dataset.index, 10);
        if (inquiryImages[idx]) {
          inquiryPreviewImg.style.opacity = '0';
          setTimeout(function () {
            inquiryPreviewImg.src = inquiryImages[idx];
            inquiryPreviewImg.onload = function () { inquiryPreviewImg.style.opacity = '1'; };
          }, 200);
        }
      });
    });
  }

  /* ---- Material swatch selector ---- */
  var swatches = document.querySelectorAll('.swatch');
  var materialsMainImg = document.getElementById('materialsMainImg');

  if (swatches.length) {
    swatches.forEach(function (s) {
      s.addEventListener('click', function () {
        swatches.forEach(function (sw) { sw.classList.remove('is-active'); });
        this.classList.add('is-active');
        var variantImg = this.getAttribute('data-variant-img');
        if (variantImg && materialsMainImg) {
          materialsMainImg.style.opacity = '0';
          setTimeout(function () {
            materialsMainImg.src = variantImg;
            materialsMainImg.style.opacity = '1';
          }, 300);
        }
      });
    });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var question = item.querySelector('.faq-item__question');
    if (question) {
      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');
        document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('is-open'); });
        if (!isOpen) item.classList.add('is-open');
      });
    }
  });

  /* ---- Inquiry form ---- */
  var inquiryForm = document.getElementById('inquiryForm');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = this.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.textContent = 'Sending\u2026';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = 'Thank You';
        setTimeout(function () {
          e.target.reset();
          btn.textContent = original;
          btn.disabled = false;
        }, 2000);
      }, 1000);
    });
  }

  /* ---- Progressive image fade ---- */
  document.querySelectorAll('.product-hero__img, .gallery-strip__img, .editorial-split__img, .materials__media img, .creation-card__img, .specs__drawing img').forEach(function (img) {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.7s ease';
    function show() { img.style.opacity = '1'; }
    if (img.complete && img.naturalHeight !== 0) show();
    else img.addEventListener('load', show);
  });

})();
