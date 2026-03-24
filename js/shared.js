/* ============================================
   TIBA STONE — SHARED JAVASCRIPT
   Header scroll, mobile menu, scroll reveal,
   footer form handler, lightbox
============================================ */
(function () {
  'use strict';

  /* ---- Header scroll ---- */
  var header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('is-scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ---- Mobile menu ---- */
  var hamburger = document.getElementById('hamburgerBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileClose = document.getElementById('mobileMenuClose');

  function closeMobile() {
    if (mobileMenu) {
      mobileMenu.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      mobileMenu.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileClose) mobileClose.addEventListener('click', closeMobile);
  if (mobileMenu) {
    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(function (l) {
      l.addEventListener('click', closeMobile);
    });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMobile(); });

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---- Footer form handler ---- */
  var footerForm = document.getElementById('footerForm');
  if (footerForm) {
    footerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var form = e.target;
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.textContent = 'Sending\u2026';
      btn.disabled = true;
      fetch('https://formspree.io/f/luke@tibaliving.com', {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (r) {
        if (r.ok) {
          btn.textContent = 'Sent';
          setTimeout(function () {
            form.reset();
            btn.textContent = original;
            btn.disabled = false;
          }, 3000);
        } else {
          btn.textContent = 'Error';
          btn.disabled = false;
        }
      }).catch(function () {
        btn.textContent = 'Error';
        btn.disabled = false;
      });
    });
  }

  /* ---- Lightbox ---- */
  var lb = document.getElementById('tsLb');
  if (lb) {
    var lbImg = lb.querySelector('img');
    function closeLb() { lb.classList.remove('is-open'); document.body.style.overflow = ''; }
    document.querySelectorAll('.product-hero__img,.gallery-strip__img,.editorial-split__img,.specs__drawing img,.materials__media img,.inquiry__preview-img,.hero__slide-img,.hero__bg-img,.source-card__img').forEach(function (el) {
      el.classList.add('ts-lb-trigger');
      el.addEventListener('click', function () {
        lbImg.src = this.currentSrc || this.src;
        lbImg.alt = this.alt;
        lb.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    });
    lb.addEventListener('click', closeLb);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });
  }

})();
