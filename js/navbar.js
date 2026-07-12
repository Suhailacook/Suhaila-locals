// Enhanced accessible navbar behaviors with smooth animations and improved UX
(function(){
  const menu = document.querySelector('.navbar-links');
  const btn = document.querySelector('.hamburger');
  const overlay = document.querySelector('.menu-overlay');
  const dropdowns = Array.from(document.querySelectorAll('.dropdown'));
  const navbar = document.querySelector('.navbar');
  
  // ===== Focus Trapping =====
  function trapFocus(container){
    const focusable = container.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return ()=>{};
    const first = focusable[0];
    const last = focusable[focusable.length-1];
    function handle(e){
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first){ 
        e.preventDefault(); 
        last.focus();
      }
      else if (!e.shiftKey && document.activeElement === last){ 
        e.preventDefault(); 
        first.focus();
      }
    }
    document.addEventListener('keydown', handle);
    return ()=>document.removeEventListener('keydown', handle);
  }

  let untrap = null;

  // ===== Menu Open/Close Functions =====
  function openMenu(){
    if (!menu) return;
    menu.classList.add('open');
    btn && btn.classList.add('open');
    overlay && overlay.classList.add('active');
    document.body.classList.add('menu-open');
    untrap = trapFocus(menu);
    document.body.style.overflow = 'hidden';
    
    // Set focus to first menu item
    setTimeout(() => {
      const firstLink = menu.querySelector('a, button');
      firstLink && firstLink.focus();
    }, 100);
  }
  
  function closeMenu(){
    if (!menu) return;
    menu.classList.remove('open');
    btn && btn.classList.remove('open');
    overlay && overlay.classList.remove('active');
    document.body.classList.remove('menu-open');
    if (untrap) { 
      untrap(); 
      untrap = null;
    }
    document.body.style.overflow = '';
    
    // Return focus to hamburger button
    btn && btn.focus();
  }

  // ===== Hamburger Button Click Handler =====
  if (btn){
    btn.addEventListener('click', ()=>{
      if (menu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }
  
  // ===== Overlay Click Handler =====
  if (overlay){ 
    overlay.addEventListener('click', closeMenu);
  }

  // ===== Escape Key Handler =====
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape' && menu && menu.classList.contains('open')) {
      closeMenu();
    }
  });

  // ===== Dropdown Toggle on Mobile =====
  dropdowns.forEach(dd=>{
    const toggle = dd.querySelector('.dropbtn');
    if (!toggle) return;
    
    toggle.addEventListener('click', (ev)=>{
      // Only toggle on mobile (max-width: 800px)
      if (window.innerWidth <= 800) {
        ev.preventDefault();
        
        // Close other open dropdowns
        dropdowns.forEach(other => {
          if (other !== dd && other.classList.contains('open')) {
            other.classList.remove('open');
          }
        });
        
        // Toggle current dropdown
        dd.classList.toggle('open');
      }
    });
  });
  
  // Close dropdowns when clicking outside on mobile
  document.addEventListener('click', (e)=>{
    if (window.innerWidth <= 800) {
      if (!e.target.closest('.navbar')) {
        dropdowns.forEach(dd => dd.classList.remove('open'));
      }
    }
  });
  
  // Close dropdowns on window resize from mobile to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 800) {
      dropdowns.forEach(dd => dd.classList.remove('open'));
      // Also close menu if resizing from mobile to desktop
      if (menu && menu.classList.contains('open')) {
        closeMenu();
      }
    }
  });

  // ===== Active Link Highlighting =====
  function updateActiveLinks(){
    const currentFilename = location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.navbar-links a');
    
    links.forEach(a=>{
      try{
        const href = new URL(a.href, location.origin).pathname.split('/').pop() || 'index.html';
        if (href === currentFilename){ 
          a.classList.add('active'); 
        } else {
          a.classList.remove('active');
        }
      }catch(e){}
    });

    // If any dropdown child matches the current path, mark the parent dropbtn active
    dropdowns.forEach(dd=>{
      const items = Array.from(dd.querySelectorAll('.dropdown-content a'));
      const btn = dd.querySelector('.dropbtn');
      if (!btn || !items.length) return;
      
      btn.classList.remove('active');
      
      for (const it of items){
        try{
          const href = new URL(it.href, location.origin).pathname.split('/').pop() || 'index.html';
          if (href === currentFilename){ 
            btn.classList.add('active'); 
            break;
          }
        }catch(e){}
      }
    });
  }
  
  // Update active links on page load
  updateActiveLinks();
  
  // Update active links when clicking a link (for SPAs)
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.closest('.navbar')) {
      setTimeout(updateActiveLinks, 100);
    }
  });

  // ===== Navbar Hide/Show on Scroll =====
  if (navbar) {
    let lastScrollY = window.scrollY;
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      
      if (window.scrollY > lastScrollY && window.scrollY > 60) {
        // Scrolling down - hide navbar
        navbar.style.top = '-80px';
      } else {
        // Scrolling up - show navbar
        navbar.style.top = '0';
      }
      lastScrollY = window.scrollY;
      
      // Reset position when menu is open
      if (menu && menu.classList.contains('open')) {
        navbar.style.top = '0';
      }
    }, false);
  }

  // ===== Insert Skip Link for Accessibility =====
  if (!document.querySelector('.skip-link')){
    const skip = document.createElement('a');
    skip.href = '#main-content';
    skip.className = 'skip-link';
    skip.textContent = 'Skip to content';
    document.body.insertBefore(skip, document.body.firstChild);
  }

  // ===== Close menu when clicking on a link =====
  const navLinks = document.querySelectorAll('.navbar-links a:not(.dropbtn)');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Close menu after a short delay to allow navigation
      setTimeout(closeMenu, 100);
    });
  });

  // ===== Mobile Menu Accessibility Improvements =====
  // Ensure hamburger button has proper ARIA attributes
  if (btn) {
    btn.setAttribute('aria-label', 'Toggle navigation menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'navbarLinks');
    
    // Update aria-expanded when menu state changes
    const originalOpen = openMenu;
    const originalClose = closeMenu;
    
    window.openMenu = function() {
      originalOpen();
      btn.setAttribute('aria-expanded', 'true');
    };
    
    window.closeMenu = function() {
      originalClose();
      btn.setAttribute('aria-expanded', 'false');
    };
  }
})();
