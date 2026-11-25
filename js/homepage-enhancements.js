// Homepage enhancements: mobile booking bar, rating counter, staggered card reveal.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----- Mobile booking bar: show after the hero leaves the screen -----
  var bar = document.querySelector('.mobile-book-bar');
  var hero = document.querySelector('.hero-section');
  var footer = document.querySelector('footer');
  if (bar && hero && 'IntersectionObserver' in window) {
    var heroVisible = true, footerVisible = false;
    var update = function () {
      var show = !heroVisible && !footerVisible;
      bar.classList.toggle('is-visible', show);
      bar.setAttribute('aria-hidden', show ? 'false' : 'true');
      bar.querySelectorAll('a').forEach(function (a) { a.tabIndex = show ? 0 : -1; });
      document.body.classList.toggle('has-book-bar', show);
    };
    new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; update(); }, { threshold: 0 }).observe(hero);
    if (footer) new IntersectionObserver(function (e) { footerVisible = e[0].isIntersecting; update(); }, { threshold: 0 }).observe(footer);
  }

  // ----- Rating counter (0 → 4.9) -----
  var counter = document.querySelector('[data-count-to]');
  if (counter && !reduce && 'IntersectionObserver' in window) {
    var target = parseFloat(counter.getAttribute('data-count-to'));
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      var start = null;
      var step = function (t) {
        if (!start) start = t;
        var p = Math.min((t - start) / 800, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        counter.textContent = (target * eased).toFixed(1);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(counter);
  }

  // ----- Staggered reveal for cards and steps -----
  if (!reduce && 'IntersectionObserver' in window) {
    var groups = document.querySelectorAll('.product-gallery, .how-steps, .review-carousel, .faq-list');
    groups.forEach(function (g) {
      var items = Array.prototype.slice.call(g.children);
      items.forEach(function (el, i) {
        el.classList.add('sl-stagger');
        el.style.transitionDelay = (i * 70) + 'ms';
      });
      var obs = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        obs.disconnect();
        items.forEach(function (el) { el.classList.add('sl-in'); });
        setTimeout(function () { items.forEach(function (el) { el.style.transitionDelay = ''; }); }, 900);
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      obs.observe(g);
    });
  }
})();
