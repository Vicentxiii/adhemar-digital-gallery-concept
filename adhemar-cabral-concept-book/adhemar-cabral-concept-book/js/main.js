/* ================================================================
   ADHEMAR CABRAL — CREATIVE DIRECTION PROPOSAL
   Vanilla JS. No dependencies.
   ================================================================ */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------------------
     Preloader
     ------------------------------------------------------------- */

  var preloader = document.getElementById('preloader');

  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add('is-hidden');
  }

  if (reduceMotion) {
    hidePreloader();
  } else {
    window.addEventListener('load', function () {
      setTimeout(hidePreloader, 900);
    });
    // Safety net in case 'load' is delayed by slow assets.
    setTimeout(hidePreloader, 2500);
  }

  /* -------------------------------------------------------------
     Scroll-triggered reveal
     ------------------------------------------------------------- */

  var revealTargets = document.querySelectorAll('.reveal-io');

  if ('IntersectionObserver' in window && revealTargets.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
    );

    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* -------------------------------------------------------------
     Active chapter in the rail
     ------------------------------------------------------------- */

  var chapters = document.querySelectorAll('.chapter');
  var railLinks = document.querySelectorAll('.rail__list a');

  if ('IntersectionObserver' in window && chapters.length && railLinks.length) {
    var chapterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var index = entry.target.getAttribute('data-chapter-index');
            railLinks.forEach(function (link) {
              link.classList.toggle(
                'is-active',
                link.getAttribute('data-chapter') === index
              );
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    chapters.forEach(function (chapter) {
      chapterObserver.observe(chapter);
    });
  }

  /* -------------------------------------------------------------
     Top progress line (mobile)
     ------------------------------------------------------------- */

  var progressFill = document.getElementById('progressFill');

  function updateProgress() {
    if (!progressFill) return;
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = docHeight > 0 ? scrollTop / docHeight : 0;
    progressFill.style.width = Math.min(100, Math.max(0, ratio * 100)) + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

})();
