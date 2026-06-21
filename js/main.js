
// Mobile menu functionality
const hamburger = document.getElementById('hamburger');
const navbarLinks = document.getElementById('navbarLinks');
const menuOverlay = document.getElementById('menuOverlay');

hamburger?.addEventListener('click', function () {
    navbarLinks.classList.toggle('open');
    menuOverlay.classList.toggle('active');
});

menuOverlay?.addEventListener('click', function () {
    navbarLinks.classList.remove('open');
    menuOverlay.classList.remove('active');
});

// Navbar hide/show on scroll
document.addEventListener('DOMContentLoaded', function () {
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && window.scrollY > 60) {
            navbar.style.top = '-80px';
        } else {
            navbar.style.top = '0';
        }
        lastScrollY = window.scrollY;
    });
});

// Highlight active nav link
const currentPath = window.location.pathname.split("/").pop();
const navLinks = document.querySelectorAll('.navbar a');
navLinks.forEach(link => {
    link.classList.remove('active');
    link.removeAttribute('aria-current');
    if (link.getAttribute('href') === currentPath || (currentPath === "" && link.getAttribute('href') === "index.html")) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
    }
});

// Lightbox
(function(){
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    function getGalleryImages(){
        return Array.from(document.querySelectorAll('.gallery-item img.gallery-img'));
    }

    let currentIndex = 0;

    function showImageByIndex(idx){
        const imgs = getGalleryImages();
        if (!imgs.length || !lbImg) return;
        currentIndex = ((idx % imgs.length) + imgs.length) % imgs.length;
        const img = imgs[currentIndex];
        const src = img.dataset.largeSrc || img.src;
        lbImg.src = src;
        lbImg.alt = img.alt || '';
        lbImg.dataset.currentSrc = src;
    }

    window.openLightbox = function(el){
        if (!el) return;
        let imgEl = el.tagName === 'IMG' ? el : (el.querySelector && el.querySelector('img')) || el.querySelector('.gallery-img');
        const imgs = getGalleryImages();
        let idx = imgs.findIndex(g => g === imgEl);
        if (idx === -1 && imgEl) {
            const target = imgEl.dataset.largeSrc || imgEl.src;
            idx = imgs.findIndex(g => (g.dataset.largeSrc || g.src) === target);
        }
        if (idx === -1) idx = 0;
        showImageByIndex(idx);
        lightbox?.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeLightbox = function(){
        lightbox?.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { if(lbImg) lbImg.src = ''; delete lbImg.dataset.currentSrc; }, 300);
    };

    function prevImage(){ showImageByIndex(currentIndex - 1); }
    function nextImage(){ showImageByIndex(currentIndex + 1); }

    prevBtn?.addEventListener('click', ev => { ev.stopPropagation(); prevImage(); });
    nextBtn?.addEventListener('click', ev => { ev.stopPropagation(); nextImage(); });

    lightbox?.addEventListener('click', (ev) => {
        if (ev.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'Escape') closeLightbox();
    });

    document.addEventListener('click', (e) => {
        const overlay = e.target.closest('.gallery-overlay');
        if (!overlay) return;
        const parent = overlay.closest('.gallery-item');
        if (!parent) return;
        const img = parent.querySelector('img.gallery-img');
        if (img) openLightbox(img);
    });
})();

// Review carousel
let currentReview = 0;
const reviewCards = document.querySelectorAll('.review-card');
function showReviewCard(idx) {
    reviewCards.forEach((card, i) => card.classList.toggle('active', i === idx));
}
function prevReview() {
    currentReview = (currentReview - 1 + reviewCards.length) % reviewCards.length;
    showReviewCard(currentReview);
}
function nextReview() {
    currentReview = (currentReview + 1) % reviewCards.length;
    showReviewCard(currentReview);
}
window.prevReview = prevReview;
window.nextReview = nextReview;
if (reviewCards.length > 0) {
    showReviewCard(currentReview);
}


// Book Now redirect
window.redirectToReservation = function (experienceName) {
    window.location.href = "Reservation.html?experience=" + encodeURIComponent(experienceName);
};

// Scroll-triggered animations
document.addEventListener('DOMContentLoaded', () => {
    const animateOnScrollElements = document.querySelectorAll(
        '.gallery-title, .meet-family-section, .meet-family-section h2, .about-section h2, .about-text, #blog-section h2, .review-section-advanced h2, .featured-story-content'
    );
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.12 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    animateOnScrollElements.forEach(el => observer.observe(el));

    const staggeredObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const childrenToAnimate = Array.from(entry.target.children);
                childrenToAnimate.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, index * 150);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    const recentPostsContainer = document.querySelector('.recent-posts');
    if (recentPostsContainer) staggeredObserver.observe(recentPostsContainer);

    const productGalleryContainer = document.querySelector('.product-gallery');
    if (productGalleryContainer) staggeredObserver.observe(productGalleryContainer);

    const meetFamilyContainer = document.querySelector('.meet-family-section');
    if (meetFamilyContainer) staggeredObserver.observe(meetFamilyContainer);

    document.querySelectorAll('.product-item').forEach(el => el.classList.add('visible'));
});

// toggle dropdown on small screens
document.querySelectorAll('.navbar .dropbtn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        if (window.innerWidth <= 800) {
            e.preventDefault();
            const dd = this.closest('.dropdown');
            // close other open dropdowns first
            document.querySelectorAll('.navbar .dropdown.open').forEach(o => { if (o !== dd) o.classList.remove('open'); });
            dd.classList.toggle('open');
        }
    });
});

// click outside to close mobile dropdown
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 800) {
        if (!e.target.closest('.navbar')) {
            document.querySelectorAll('.navbar .dropdown.open').forEach(o => o.classList.remove('open'));
        }
    }
});

// optional: close on resize from mobile -> desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 800) document.querySelectorAll('.navbar .dropdown.open').forEach(o => o.classList.remove('open'));
});
