/**
 * Modern Motion Effects - Intersection Observer for Scroll Animations
 * This script adds smooth, performant animations to elements as they enter the viewport
 */

// Check if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Intersection Observer configuration
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px' // Trigger animation slightly before element is fully visible
};

// Create Intersection Observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting && !prefersReducedMotion) {
      // Add staggered delay for multiple elements
      const delay = entry.target.dataset.delay || index * 0.1;
      entry.target.style.animationDelay = `${delay}s`;
      entry.target.classList.add('animate-in');
      
      // Stop observing once animated
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
  // Observe all elements with data-animate attribute
  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });

  // Observe cards for staggered animation
  document.querySelectorAll('.reservation-item, .gallery-item, .recent-posts article, .product-item, .review-card').forEach((el, index) => {
    el.dataset.delay = (index * 0.1).toString();
    observer.observe(el);
  });

  // Smooth scroll behavior for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add subtle parallax effect to hero section
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      if (!prefersReducedMotion) {
        const scrollY = window.scrollY;
        heroSection.style.backgroundPosition = `center ${scrollY * 0.5}px`;
      }
    });
  }

  // Navbar hide/show on scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
      } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);

    // Add transition to navbar
    navbar.style.transition = `transform ${220}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
  }

  // Add hover effects to links
  document.querySelectorAll('a:not(.button):not(.sr-only)').forEach(link => {
    link.addEventListener('mouseenter', function() {
      if (!prefersReducedMotion) {
        this.style.transition = 'color 220ms cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      }
    });
  });

  // Form input focus effects
  document.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('focus', function() {
      if (!prefersReducedMotion) {
        this.style.transition = 'all 220ms cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        this.style.boxShadow = '0 0 0 3px rgba(0, 121, 140, 0.1)';
      }
    });

    input.addEventListener('blur', function() {
      this.style.boxShadow = 'none';
    });
  });

  // Button ripple effect on click
  document.querySelectorAll('.button, .btn').forEach(button => {
    button.addEventListener('click', function(e) {
      if (!prefersReducedMotion) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      }
    });
  });
});

// Add ripple effect CSS dynamically
const style = document.createElement('style');
style.textContent = `
  .button, .btn {
    position: relative;
    overflow: hidden;
  }

  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }

  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  /* Smooth transitions for all interactive elements */
  button, a, input, textarea, select {
    transition: all 220ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  /* Scroll animation classes */
  .animate-in {
    animation: slideInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  .animate-in.fade-in {
    animation: fadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  .animate-in.scale-in {
    animation: scaleIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }
`;
document.head.appendChild(style);

// Export for use in other scripts
window.motionEffects = {
  observer,
  prefersReducedMotion
};
