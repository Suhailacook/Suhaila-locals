/* Suhaila Locals — site-wide progressive enhancement */
(function () {
    'use strict';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    function addRevealTargets() {
        const selectors = [
            '.hero-section', '.reservation-hero', '.contact-hero-section', '.blog-hero', '.experience-hero',
            'main > section', '.main-content-grid', '.post-container', '.rec-card', '.blog-card',
            '.reservation-item', '.info-card', '.value-card', '.faq-item', '.quick-facts-table',
            '.booking-module', '.host-profile', '.gallery-item'
        ];
        let index = 0;
        selectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach((element) => {
                if (element.classList.contains('site-reveal')) return;
                element.classList.add('site-reveal');
                if (/card|item|info-card|gallery-item/i.test(element.className)) {
                    element.classList.add('site-reveal-scale');
                }
                element.style.setProperty('--site-delay', `${Math.min(index++ * 55, 360)}ms`);
            });
        });
    }

    function initReveal() {
        const targets = document.querySelectorAll('.site-reveal');
        if (!targets.length || reducedMotion || !('IntersectionObserver' in window)) {
            targets.forEach((target) => target.classList.add('site-visible'));
            return;
        }
        const observer = new IntersectionObserver((entries, revealObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('site-visible');
                revealObserver.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.07 });
        targets.forEach((target) => observer.observe(target));
    }

    function initPointerDepth() {
        if (!finePointer || reducedMotion) return;
        document.querySelectorAll('.hero-section, .reservation-hero, .contact-hero-section, .blog-hero, .experience-hero').forEach((hero) => {
            hero.addEventListener('pointermove', (event) => {
                const bounds = hero.getBoundingClientRect();
                hero.style.setProperty('--site-pointer-x', `${(((event.clientX - bounds.left) / bounds.width) * 100).toFixed(1)}%`);
                hero.style.setProperty('--site-pointer-y', `${(((event.clientY - bounds.top) / bounds.height) * 100).toFixed(1)}%`);
                hero.classList.add('site-pointer-active');
            });
            hero.addEventListener('pointerleave', () => hero.classList.remove('site-pointer-active'));
        });
    }

    function initTilt() {
        if (!finePointer || reducedMotion) return;
        document.querySelectorAll('.rec-card, .blog-card, .reservation-item, .info-card, .value-card, .gallery-item').forEach((card) => {
            card.classList.add('site-tilt');
            card.addEventListener('pointermove', (event) => {
                const bounds = card.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / bounds.width;
                const y = (event.clientY - bounds.top) / bounds.height;
                card.style.setProperty('--site-tilt-x', `${((0.5 - y) * 4).toFixed(2)}deg`);
                card.style.setProperty('--site-tilt-y', `${((x - 0.5) * 4).toFixed(2)}deg`);
            });
            card.addEventListener('pointerleave', () => {
                card.style.setProperty('--site-tilt-x', '0deg');
                card.style.setProperty('--site-tilt-y', '0deg');
            });
        });
    }

    function initButtonFeedback() {
        if (reducedMotion) return;
        document.querySelectorAll('button, .button, .nav-reserve, .read-more-btn, .learn-more').forEach((button) => {
            if (button.classList.contains('site-ripple-button')) return;
            button.classList.add('site-ripple-button');
            button.addEventListener('click', (event) => {
                const bounds = button.getBoundingClientRect();
                const ripple = document.createElement('span');
                ripple.className = 'site-ripple';
                ripple.style.left = `${event.clientX - bounds.left - 6}px`;
                ripple.style.top = `${event.clientY - bounds.top - 6}px`;
                button.appendChild(ripple);
                ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
            });
        });
    }

    function init() {
        addRevealTargets();
        initReveal();
        initPointerDepth();
        initTilt();
        initButtonFeedback();
        document.documentElement.classList.add('site-interactions-ready');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
