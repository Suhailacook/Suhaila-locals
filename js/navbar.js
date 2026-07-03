document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger');
  const navbarLinks = document.getElementById('navbarLinks');
  const menuOverlay = document.getElementById('menuOverlay');

  if (hamburger && navbarLinks && menuOverlay) {
    hamburger.addEventListener('click', function () {
      navbarLinks.classList.toggle('open');
      menuOverlay.classList.toggle('active');
    });

    menuOverlay.addEventListener('click', function () {
      navbarLinks.classList.remove('open');
      menuOverlay.classList.remove('active');
    });
  }

  // Mobile dropdown behavior
  document.querySelectorAll('.navbar .dropbtn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        const dd = this.closest('.dropdown');
        document.querySelectorAll('.navbar .dropdown.open').forEach(o => { if (o !== dd) o.classList.remove('open'); });
        dd.classList.toggle('open');
      }
    });
  });

  // Close open dropdowns when clicking outside (mobile)
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 900) {
      if (!e.target.closest('.navbar')) {
        document.querySelectorAll('.navbar .dropdown.open').forEach(o => o.classList.remove('open'));
      }
    }
  });

  // Close mobile nav when resizing to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      document.querySelectorAll('.navbar .dropdown.open').forEach(o => o.classList.remove('open'));
      if (navbarLinks) navbarLinks.classList.remove('open');
      if (menuOverlay) menuOverlay.classList.remove('active');
    }
  });
});
