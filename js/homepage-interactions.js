/* Suhaila Locals — homepage interactions
   Progressive enhancement only: the page remains fully usable without JavaScript. */
(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)');

    function markRevealTargets() {
        const groups = [
            ['.trust-item', 'up'],
            ['.trust-cta', 'up'],
            ['.experiences > h2', 'up'],
            ['.product-item', 'scale'],
            ['.gallery-title', 'up'],
            ['.gallery-item', 'scale'],
            ['.meet-family-photo-wrap', 'scale'],
            ['.meet-family-content', 'up'],
            ['#blog-section > *', 'up'],
            ['.review-section-advanced > *', 'up']
        ];

        groups.forEach(([selector, effect]) => {
            document.querySelectorAll(selector).forEach((element, index) => {
                if (element.dataset.reveal) return;
                element.dataset.reveal = effect;
                element.style.setProperty('--reveal-delay', `${Math.min(index * 65, 390)}ms`);
            });
        });

        document.querySelectorAll('.product-item, .gallery-item').forEach((element) => {
            element.dataset.tilt = 'true';
        });
    }

    function initReveal() {
        const targets = document.querySelectorAll('[data-reveal]');
        if (!targets.length) return;

        if (reduceMotion.matches || !('IntersectionObserver' in window)) {
            targets.forEach((element) => element.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries, revealObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -9% 0px', threshold: 0.08 });

        targets.forEach((element) => observer.observe(element));
    }

    function initTilt() {
        if (!canTilt.matches || reduceMotion.matches) return;

        document.querySelectorAll('[data-tilt]').forEach((card) => {
            card.addEventListener('pointermove', (event) => {
                const bounds = card.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / bounds.width;
                const y = (event.clientY - bounds.top) / bounds.height;
                const tiltX = ((0.5 - y) * 5).toFixed(2);
                const tiltY = ((x - 0.5) * 5).toFixed(2);
                card.style.setProperty('--tilt-x', `${tiltX}deg`);
                card.style.setProperty('--tilt-y', `${tiltY}deg`);
            });

            card.addEventListener('pointerleave', () => {
                card.style.setProperty('--tilt-x', '0deg');
                card.style.setProperty('--tilt-y', '0deg');
            });
        });
    }

    function initHeroParallax() {
        const hero = document.querySelector('.hero-section');
        if (!hero || reduceMotion.matches || !canTilt.matches) return;

        hero.addEventListener('pointermove', (event) => {
            const bounds = hero.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width;
            const y = (event.clientY - bounds.top) / bounds.height;
            hero.style.setProperty('--hero-pointer-x', `${(x * 100).toFixed(1)}%`);
            hero.style.setProperty('--hero-pointer-y', `${(y * 100).toFixed(1)}%`);
            hero.style.setProperty('--hero-shift-x', `${((x - 0.5) * 12).toFixed(1)}px`);
            hero.style.setProperty('--hero-shift-y', `${((y - 0.5) * 8).toFixed(1)}px`);
        });

        hero.addEventListener('pointerleave', () => {
            hero.style.setProperty('--hero-pointer-x', '50%');
            hero.style.setProperty('--hero-pointer-y', '42%');
            hero.style.setProperty('--hero-shift-x', '0px');
            hero.style.setProperty('--hero-shift-y', '0px');
        });
    }

    function initScrollProgress() {
        const progress = document.getElementById('scroll-progress');
        if (!progress) return;

        let ticking = false;
        const update = () => {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
            progress.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
        update();
    }

    function init() {
        markRevealTargets();
        initReveal();
        initTilt();
        initHeroParallax();
        initScrollProgress();
        document.documentElement.classList.add('homepage-interactions-ready');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
