/**
 * Online Cooking Class Booking System
 * Manages calendar events, event details display, and booking form submission
 */

let calendar;
let selectedEvent = null;

/**
 * Initialize the booking system when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
  initializeCalendar();
  setupNavigation();
  setupEventListeners();
});

/**
 * Initialize FullCalendar with online cooking class events
 */
function initializeCalendar() {
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) return;

  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,listMonth'
    },
    events: function(info, successCallback, failureCallback) {
      fetch('data/online-classes.json')
        .then(response => response.json())
        .then(data => {
          successCallback(data);
        })
        .catch(error => {
          console.error('Error loading events:', error);
          failureCallback(error);
        });
    },
    eventClick: function(info) {
      selectedEvent = info.event;
      displayEventDetails(info.event);
    }
  });
  calendar.render();
}

/**
 * Display event details in the sidebar
 * @param {FullCalendar.EventApi} event - The selected event
 */
function displayEventDetails(event) {
  const detailsDiv = document.getElementById('event-details');
  if (!detailsDiv) return;

  const props = event.extendedProps;
  
  let menuHTML = '';
  if (props.menu) {
    const menuItems = props.menu.split(',').map(item => `<li>${item.trim()}</li>`);
    menuHTML = `<ul class="menu-list">${menuItems.join('')}</ul>`;
  }

  const startTime = new Date(event.start);
  const endTime = new Date(event.end);
  const dateStr = startTime.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const timeStr = `${startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

  detailsDiv.innerHTML = `
    <h3>${event.title}</h3>
    
    <div class="price-display">
      <div class="price-label">Price per camera/connection</div>
      <div class="price-amount">${props.price}</div>
    </div>

    <div class="event-detail-item">
      <div class="event-detail-label">📅 Date & Time</div>
      <div class="event-detail-value">
        <strong>${dateStr}</strong><br>
        ${timeStr}
      </div>
    </div>

    <div class="event-detail-item">
      <div class="event-detail-label">🍽️ Menu</div>
      <div class="event-detail-value">
        ${menuHTML}
      </div>
    </div>

    <div class="event-detail-item">
      <div class="event-detail-label">📝 Description</div>
      <div class="event-detail-value">${props.description}</div>
    </div>

    <div class="event-detail-item">
      <div class="event-detail-label">🔗 Zoom Link</div>
      <div class="event-detail-value">
        <a href="${props.zoomLink}" target="_blank" rel="noopener noreferrer">Join via Zoom</a>
        <br><small style="color: #999;">(Provided after booking confirmation)</small>
      </div>
    </div>

    <button class="booking-button" onclick="openBookingModal('${event.id}', '${event.title}', '${dateStr} ${timeStr}')">
      Book This Class
    </button>
  `;
}

/**
 * Open the booking modal
 * @param {string} eventId - The event ID
 * @param {string} eventTitle - The event title
 * @param {string} eventDateTime - The formatted date and time
 */
function openBookingModal(eventId, eventTitle, eventDateTime) {
  document.getElementById('selectedEventId').value = eventId;
  document.getElementById('selectedEventTitle').value = eventTitle;
  document.getElementById('selectedEventDateTime').value = eventDateTime;
  document.getElementById('bookingModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * Close the booking modal
 */
function closeBookingModal() {
  document.getElementById('bookingModal').classList.remove('active');
  document.body.style.overflow = 'auto';
  document.getElementById('bookingForm').reset();
  document.getElementById('successMessage').classList.remove('active');
}

/**
 * Submit the booking form
 * @param {Event} event - The form submission event
 */
function submitBooking(event) {
  event.preventDefault();
  
  const formData = new FormData(document.getElementById('bookingForm'));
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    participants: formData.get('participants'),
    dietary_restrictions: formData.get('dietary_restrictions'),
    eventTitle: formData.get('eventTitle'),
    eventDateTime: formData.get('eventDateTime'),
    bookingType: 'Online Cooking Class'
  };

  // Send to Formspree - Replace with your actual endpoint
  fetch('https://formspree.io/f/xyzabc123', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.ok) {
      document.getElementById('successMessage').classList.add('active');
      setTimeout(() => {
        closeBookingModal();
      }, 2000);
    } else {
      alert('There was an error submitting your booking. Please try again.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('There was an error submitting your booking. Please try again.');
  });
}

/**
 * Setup navigation functionality
 */
function setupNavigation() {
  const hamburger = document.getElementById('hamburger');
  const navbarLinks = document.getElementById('navbarLinks');
  const menuOverlay = document.getElementById('menuOverlay');

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      navbarLinks.classList.toggle('open');
      menuOverlay.classList.toggle('active');
    });
  }

  if (menuOverlay) {
    menuOverlay.addEventListener('click', function () {
      navbarLinks.classList.remove('open');
      menuOverlay.classList.remove('active');
    });
  }

  // Navbar scroll effect
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

  // Dropdown toggle on small screens
  document.querySelectorAll('.navbar .dropbtn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (window.innerWidth <= 800) {
        e.preventDefault();
        const dd = this.closest('.dropdown');
        document.querySelectorAll('.navbar .dropdown.open').forEach(o => { 
          if (o !== dd) o.classList.remove('open'); 
        });
        dd.classList.toggle('open');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 800) {
      if (!e.target.closest('.navbar')) {
        document.querySelectorAll('.navbar .dropdown.open').forEach(o => o.classList.remove('open'));
      }
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 800) {
      document.querySelectorAll('.navbar .dropdown.open').forEach(o => o.classList.remove('open'));
    }
  });
}

/**
 * Setup additional event listeners
 */
function setupEventListeners() {
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target === modal) {
      closeBookingModal();
    }
  });
}
