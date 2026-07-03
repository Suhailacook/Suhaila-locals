// Accessible navbar behaviors: toggle mobile menu, trap focus, close on Escape, active link highlighting
(function(){
  const menu = document.querySelector('.navbar-links');
  const btn = document.querySelector('.hamburger');
  const overlay = document.querySelector('.menu-overlay');
  const dropdowns = Array.from(document.querySelectorAll('.dropdown'));

  function trapFocus(container){
    const focusable = container.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return ()=>{};
    const first = focusable[0];
    const last = focusable[focusable.length-1];
    function handle(e){
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', handle);
    return ()=>document.removeEventListener('keydown', handle);
  }

  let untrap = null;

  function openMenu(){
    if (!menu) return;
    menu.classList.add('open');
    btn && btn.classList.add('open');
    overlay && overlay.classList.add('active');
    untrap = trapFocus(menu);
    document.body.style.overflow = 'hidden';
  }
  function closeMenu(){
    if (!menu) return;
    menu.classList.remove('open');
    btn && btn.classList.remove('open');
    overlay && overlay.classList.remove('active');
    if (untrap) { untrap(); untrap = null }
    document.body.style.overflow = '';
  }

  if (btn){
    btn.addEventListener('click', ()=>{
      if (menu.classList.contains('open')) closeMenu(); else openMenu();
    });
  }
  if (overlay){ overlay.addEventListener('click', closeMenu) }

  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape') closeMenu();
  });

  // Dropdowns: toggle on click for small screens and keep hover for large
  dropdowns.forEach(dd=>{
    const toggle = dd.querySelector('.dropbtn');
    toggle && toggle.addEventListener('click', (ev)=>{
      ev.preventDefault();
      dd.classList.toggle('open');
    });
  });

  // Highlight active link based on current URL
  const links = document.querySelectorAll('.navbar-links a');
  const path = location.pathname.replace(/\/g,'/');
  links.forEach(a=>{
    try{
      const href = new URL(a.href, location.origin).pathname;
      if (href === path || (href !== '/' && path.startsWith(href))){ a.classList.add('active') }
    }catch(e){}
  });

  // Insert skip link for accessibility if not present
  if (!document.querySelector('.skip-link')){
    const skip = document.createElement('a');
    skip.href = '#main';
    skip.className = 'skip-link';
    skip.textContent = 'Skip to content';
    document.body.insertBefore(skip, document.body.firstChild);
  }
})();
