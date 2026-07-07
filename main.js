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
      setTimeout(hidePreloader, 5000);
    });
    // Safety net in case 'load' is delayed by slow assets.
    setTimeout(hidePreloader, 5500);
  }

  /* -------------------------------------------------------------
     Scroll-triggered reveal — GSAP ScrollTrigger
     ------------------------------------------------------------- */

  var revealTargets = document.querySelectorAll('.reveal-io');

  if (reduceMotion) {
    revealTargets.forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  } else if (window.gsap && window.ScrollTrigger && revealTargets.length) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.reveal-io').forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true
          }
        }
      );
    });
  } else if (revealTargets.length) {
    revealTargets.forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
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

  /* -------------------------------------------------------------
     Cover word carousel — infinite loop, fade in/out
     ------------------------------------------------------------- */

  var carouselWords = document.querySelectorAll('.cover__word');
  if (carouselWords.length > 1 && !reduceMotion) {
    var wordIdx = 0;
    carouselWords[wordIdx].classList.add('is-active');
    setInterval(function () {
      carouselWords[wordIdx].classList.remove('is-active');
      wordIdx = (wordIdx + 1) % carouselWords.length;
      carouselWords[wordIdx].classList.add('is-active');
    }, 2200);
  } else if (carouselWords.length > 0) {
    carouselWords[0].classList.add('is-active');
  }

})();
