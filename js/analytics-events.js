/* =====================================================================
   Suhaila Locals — Google Analytics 4 click & conversion tracking
   ---------------------------------------------------------------------
   Sends named events to GA4 (G-JZYH4T50VY) so you can see which
   buttons, pages and experiences lead to bookings.

   Events
     reserve_click            Any "Reserve" / booking link
     view_details_click       "View details" on an experience card
     whatsapp_click           Any WhatsApp link
     phone_click              tel: links
     email_click              mailto: links
     social_click             Instagram / Facebook
     review_site_click        Tripadvisor / Google / Airbnb links
     faq_open                 A FAQ question is opened
     booking_request_sent     Reservation form sent successfully   (key event)
     online_booking_sent      Online class form sent successfully  (key event)
     contact_form_submit      Contact form submitted

   Common parameters: link_location (nav, hero, card, mobile_bar, footer…),
   experience, link_text, page_type.

   Debug: add ?sl_debug=1 to any page URL to log events in the console.
   ===================================================================== */
(function () {
  var DEBUG = /[?&]sl_debug=1/.test(location.search);

  function send(name, params) {
    params = params || {};
    params.page_type = pageType();
    params.transport_type = 'beacon';
    if (DEBUG) console.log('[GA4 event]', name, params);
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
  }
  window.slTrack = send; // used by booking forms on success

  function pageType() {
    var p = location.pathname.split('/').pop().toLowerCase() || 'index.html';
    if (p === 'index.html') return 'home';
    if (p.indexOf('blog') === 0 || p.indexOf('blog-post') === 0) return 'blog';
    if (/reservation|online-booking|thank-you/.test(p)) return 'booking';
    if (/cookingclass|walkingtour|glassboat|dinningexperience|iftar|houh-delivery|multi-day|treasure-hunt|local-experiences/.test(p)) return 'experience';
    return p.replace('.html', '');
  }

  function linkLocation(el) {
    var map = [
      ['.mobile-book-bar', 'mobile_bar'],
      ['.whatsapp-fixed', 'floating_whatsapp'],
      ['.navbar', 'nav'],
      ['.hero-section, .hero, [class*="hero"]', 'hero'],
      ['.trust-strip', 'trust_strip'],
      ['.product-item, .experience-card, .experience-option-card', 'card'],
      ['.closing-cta', 'final_cta'],
      ['.how-it-works', 'how_it_works'],
      ['.home-faq, .faq, [class*="faq"]', 'faq'],
      ['.review-section-advanced, [class*="review"]', 'reviews'],
      ['.meet-family-section', 'family'],
      ['.blog-card, article', 'article'],
      ['footer', 'footer']
    ];
    for (var i = 0; i < map.length; i++) {
      try { if (el.closest(map[i][0])) return map[i][1]; } catch (e) {}
    }
    var sec = el.closest('section');
    return sec ? (sec.id || (sec.className || '').toString().split(' ')[0] || 'section') : 'page';
  }

  var PAGE_TO_EXPERIENCE = {
    'cookingclass.html': 'Authentic Cooking Class',
    'cookingclass-online.html': 'Online Cooking Class',
    'online-booking.html': 'Online Cooking Class',
    'walkingtour.html': 'Aqaba Walking Tour',
    'glassboat.html': 'Aqaba Glass Boat',
    'dinningexperience.html': 'Dining Experience',
    'iftar-experience-aqaba.html': 'Ramadan Iftar',
    'houh-delivery.html': 'Houh Delivery',
    'multi-day-aqaba-tour.html': 'Multi-day Aqaba Tour'
  };

  function experienceFor(a) {
    try {
      var u = new URL(a.href, location.href);
      var q = u.searchParams.get('experience');
      if (q) return q;
      var file = u.pathname.split('/').pop();
      if (PAGE_TO_EXPERIENCE[file]) return PAGE_TO_EXPERIENCE[file];
    } catch (e) {}
    var card = a.closest('.product-item, .experience-card');
    var h = card && card.querySelector('h3');
    if (h) return h.textContent.trim();
    var here = location.pathname.split('/').pop();
    return PAGE_TO_EXPERIENCE[here] || '(none)';
  }

  function text(a) {
    return (a.getAttribute('aria-label') || a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);
  }

  // ----- Click tracking (one delegated listener) -----
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var lower = href.toLowerCase();
    var base = { link_location: linkLocation(a), link_text: text(a) };

    if (lower.indexOf('wa.me') > -1 || lower.indexOf('whatsapp') > -1) {
      base.experience = experienceFor(a);
      return send('whatsapp_click', base);
    }
    if (lower.indexOf('tel:') === 0) return send('phone_click', base);
    if (lower.indexOf('mailto:') === 0) return send('email_click', base);
    if (/reservation\.html|online-booking\.html/.test(lower)) {
      base.experience = experienceFor(a);
      return send('reserve_click', base);
    }
    if (/instagram\.com|facebook\.com/.test(lower)) {
      base.platform = lower.indexOf('instagram') > -1 ? 'instagram' : 'facebook';
      return send('social_click', base);
    }
    if (/tripadvisor\.|airbnb\.|share\.google|google\.com\/maps|g\.page/.test(lower)) {
      base.platform = /tripadvisor/.test(lower) ? 'tripadvisor' : /airbnb/.test(lower) ? 'airbnb' : 'google';
      return send('review_site_click', base);
    }
    if (a.closest('.experience-actions, .product-item, .experience-card') &&
        PAGE_TO_EXPERIENCE[lower.split('?')[0].split('#')[0]]) {
      base.experience = experienceFor(a);
      return send('view_details_click', base);
    }
  }, true);

  // ----- FAQ opens -----
  document.addEventListener('toggle', function (e) {
    var d = e.target;
    if (d.tagName === 'DETAILS' && d.open) {
      var s = d.querySelector('summary');
      send('faq_open', { question: s ? s.textContent.trim().slice(0, 100) : '', link_location: linkLocation(d) });
    }
  }, true);

  // ----- Contact form (regular POST to Formspree) -----
  var contact = document.getElementById('contactForm');
  if (contact) {
    contact.addEventListener('submit', function () {
      send('contact_form_submit', { link_location: 'contact_form' });
    });
  }
})();
