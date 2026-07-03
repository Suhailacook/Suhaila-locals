document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const experienceParam = params.get('experience');
  const experienceField = document.getElementById('experience');
  const form = document.getElementById('reservation-form');
  const successPopup = document.getElementById('success-popup');
  const errorPopup = document.getElementById('error-popup');
  const successMsg = document.getElementById('success-message');

  if (experienceParam && experienceField) {
    const decoded = decodeURIComponent(experienceParam);
    // Try to set select value if matches, otherwise add an option
    const option = Array.from(experienceField.options).find(o => o.value === decoded);
    if (option) {
      experienceField.value = decoded;
    } else {
      const opt = document.createElement('option');
      opt.value = decoded;
      opt.textContent = decoded;
      experienceField.appendChild(opt);
      experienceField.value = decoded;
    }
  }

  function showPopup(el, message) {
    if (!el) return;
    el.querySelector('.popup-content p').textContent = message;
    el.classList.add('active');
  }

  function hidePopup(el) {
    if (!el) return;
    el.classList.remove('active');
  }

  document.querySelectorAll('.close-btn').forEach(btn => btn.addEventListener('click', (e) => {
    const popup = e.target.closest('.popup');
    hidePopup(popup);
  }));

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get('name')?.trim();
      const email = data.get('email')?.trim();
      const phone = data.get('phone')?.trim();
      const date = data.get('date');
      const guests = parseInt(data.get('guests') || '0', 10);

      if (!name || !email || !phone || !date || !guests || guests < 1) {
        showPopup(errorPopup, 'Please fill in all required fields (name, email, phone, date, guests).');
        return;
      }

      const details = `Reservation confirmed for ${name} — ${experienceField.value} on ${date} for ${guests} guest(s). We will contact you at ${email} / ${phone}.`;
      successMsg.textContent = details;
      showPopup(successPopup, details);
      form.reset();
    });
  }

});
