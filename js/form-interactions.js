/* Suhaila Locals — contact and reservation interactions
   Progressive enhancement: existing validation and submission logic remains authoritative. */
(function () {
    'use strict';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function addRevealTargets() {
        const selectors = [
            '.contact-hero-section',
            '.contact-info-panel',
            '.contact-form-card',
            '.map-section',
            '.booking-policy',
            '.reservation-item',
            '#booking-form-container',
            '#reservation-form'
        ];

        let index = 0;
        selectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach((element) => {
                if (element.dataset.formReveal) return;
                element.dataset.formReveal = element.classList.contains('reservation-item') ? 'scale' : 'up';
                element.style.setProperty('--form-reveal-delay', `${Math.min(index++ * 70, 420)}ms`);
            });
        });
    }

    function initReveal() {
        const targets = document.querySelectorAll('[data-form-reveal]');
        if (!targets.length || reducedMotion || !('IntersectionObserver' in window)) {
            targets.forEach((element) => element.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries, revealObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

        targets.forEach((element) => observer.observe(element));
    }

    function initFieldFeedback() {
        const fields = document.querySelectorAll('.contact-form-card input:not([type="hidden"]), .contact-form-card textarea, #reservation-form input:not([type="hidden"]), #reservation-form textarea, #reservation-form select');
        fields.forEach((field) => {
            const syncValueState = () => {
                const group = field.closest('.form-group, .form-col');
                if (group) group.classList.toggle('has-value', Boolean(field.value.trim()));
                if (field.classList.contains('error') && field.value.trim()) field.classList.remove('error');
            };
            field.addEventListener('input', syncValueState);
            field.addEventListener('change', syncValueState);
            field.addEventListener('blur', syncValueState);
            syncValueState();
        });

        const message = document.querySelector('#contactForm textarea[name="message"]');
        if (message && !message.nextElementSibling?.classList.contains('field-meta')) {
            const counter = document.createElement('small');
            counter.className = 'field-meta';
            counter.setAttribute('aria-live', 'polite');
            message.insertAdjacentElement('afterend', counter);
            const updateCounter = () => {
                counter.textContent = `${message.value.length} characters`;
            };
            message.addEventListener('input', updateCounter);
            updateCounter();
        }
    }

    function addRipple(button, event) {
        if (reducedMotion || !button) return;
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'form-ripple';
        ripple.style.left = `${event.clientX - rect.left - 6}px`;
        ripple.style.top = `${event.clientY - rect.top - 6}px`;
        button.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    }

    function initButtonFeedback() {
        document.querySelectorAll('.contact-form-card button, #reservation-form button').forEach((button) => {
            button.addEventListener('click', (event) => addRipple(button, event));
        });

        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', () => {
                const submit = contactForm.querySelector('button[type="submit"]');
                if (!submit) return;
                submit.classList.add('is-sending');
                submit.dataset.originalLabel = submit.textContent;
                submit.textContent = 'Sending request…';
                submit.disabled = true;
            }, { once: true });
        }
    }

    function initReservationSelection() {
        document.querySelectorAll('#reservation-form .experience-toggle').forEach((toggle) => {
            toggle.addEventListener('change', () => {
                const card = toggle.closest('.experience-option-card');
                if (!card) return;
                card.classList.toggle('selected', toggle.checked);
                if (!reducedMotion) {
                    card.classList.remove('selection-flash');
                    window.requestAnimationFrame(() => card.classList.add('selection-flash'));
                }
            });
        });
    }

    function init() {
        addRevealTargets();
        initReveal();
        initFieldFeedback();
        initButtonFeedback();
        initReservationSelection();
        document.documentElement.classList.add('form-interactions-ready');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
