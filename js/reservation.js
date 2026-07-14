/**
 * Reservation Page Logic
 * Handles experience selection, form toggles, price calculation, deep-linking,
 * FAQ interactions, and seamless AJAX form submission.
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reservation-form');
    
    // ==========================================
    // 1. Handle Experience Toggles and Pricing
    // ==========================================
    if (form) {
        const toggles = form.querySelectorAll('.experience-toggle');
        const priceDisplay = document.getElementById('price-display');
        const guestInputs = form.querySelectorAll('.guest-input');
        
        function calculateTotal() {
            let total = 0;
            toggles.forEach(toggle => {
                if (toggle.checked) {
                    const price = parseFloat(toggle.dataset.price) || 0;
                    const targetId = toggle.dataset.target;
                    const detailsDiv = document.getElementById(targetId);
                    
                    if (detailsDiv) {
                        const inputField = detailsDiv.querySelector('.guest-input');
                        // Prevent negative inputs or NaN values
                        const count = Math.max(0, parseInt(inputField ? inputField.value : 0) || 0);
                        total += price * count;
                    }
                }
            });
            if (priceDisplay) {
                priceDisplay.textContent = `Total Estimated Price: ${total.toFixed(2)} JD`;
            }
        }

        toggles.forEach(toggle => {
            toggle.addEventListener('change', function() {
                const targetId = this.dataset.target;
                const detailsDiv = document.getElementById(targetId);
                
                if (detailsDiv) {
                    if (this.checked) {
                        detailsDiv.classList.remove('collapsed');
                    } else {
                        detailsDiv.classList.add('collapsed');
                    }
                }
                calculateTotal();
            });
        });

        // Event listener attached to both guest counts and glass boat hours
        guestInputs.forEach(input => {
            input.addEventListener('input', calculateTotal);
        });

        // Run initial calculation
        calculateTotal();
    }

    // ==========================================
    // 2. Handle Query Parameters (Deep-Linking)
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    const experienceParam = urlParams.get('experience');
    
    if (experienceParam) {
        const expMap = {
            'cooking': 'Book_Cooking_Class',
            'walking': 'Book_Walking_Tour',
            'dining': 'Book_Dining_Experience',
            'glassboat': 'Book_Glass_Boat',
            'Authentic Cooking Class': 'Book_Cooking_Class',
            'Food Taste Tour': 'Book_Walking_Tour',
            'Dining Experience': 'Book_Dining_Experience',
            'Aqaba Glass Boat': 'Book_Glass_Boat',
            'Walking Tour in Aqaba': 'Book_Walking_Tour',
            'Historic Walking Tour': 'Book_Walking_Tour',
            'iftar': 'Book_Dining_Experience',
            'Ramadan Iftar': 'Book_Dining_Experience'
        };

        const fieldName = expMap[experienceParam];
        if (fieldName) {
            const checkbox = document.querySelector(`input[name="${fieldName}"]`);
            if (checkbox) {
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event('change'));
                
                setTimeout(() => {
                    const card = checkbox.closest('.experience-option-card');
                    if (card) card.scrollIntoView({ behavior: 'smooth' });
                }, 500);
            }
        }
    }

    // ==========================================
    // 3. FAQ Toggles
    // ==========================================
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const expanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !expanded);
            const answer = question.nextElementSibling;
            if (answer) {
                answer.style.display = expanded ? 'none' : 'block';
            }
            const icon = question.querySelector('.icon');
            if (icon) {
                icon.textContent = expanded ? '+' : '-';
            }
        });
    });

    // ==========================================
    // 4. AJAX Form Submission (Formspree)
    // ==========================================
    if (form) {
        const spinner = document.getElementById('loading-spinner');
        const errorPopup = document.getElementById('error-popup');
        const popupMessage = document.getElementById('popup-message');

        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent full page redirection

            // Basic front-end validation check
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();

            if (!name || !email || !phone) {
                showError("Please fill out all required contact fields.");
                return;
            }

            // Show loading spinner while requesting
            if (spinner) spinner.style.display = 'block';

            const formData = new FormData(form);

            fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (spinner) spinner.style.display = 'none';
                if (response.ok) {
                    // Redirects on success (Create a thank-you.html or replace with your desired redirect)
                    window.location.href = "thank-you.html"; 
                } else {
                    response.json().then(data => {
                        if (Object.prototype.hasOwnProperty.call(data, 'errors')) {
                            showError(data['errors'].map(err => err['message']).join(", "));
                        } else {
                            showError("Oops! There was a problem submitting your form.");
                        }
                    });
                }
            })
            .catch(error => {
                if (spinner) spinner.style.display = 'none';
                showError("We encountered a network error. Please try again.");
            });
        });

        function showError(message) {
            if (errorPopup && popupMessage) {
                popupMessage.textContent = message;
                errorPopup.style.display = 'block';
            } else {
                alert(message);
            }
        }

        // Global function to close error modal
        window.closeErrorPopup = function() {
            if (errorPopup) {
                errorPopup.style.display = 'none';
            }
        };
    }
});

// ==========================================
// 5. Global Navigation & Deep-Link Functions
// ==========================================

/**
 * Globally opens form details for a specific experience ID from on-page action buttons
 */
window.openForm = function(experienceType) {
    const form = document.getElementById('reservation-form');
    
    const expMap = {
        'cooking': 'Book_Cooking_Class',
        'walking': 'Book_Walking_Tour',
        'dining': 'Book_Dining_Experience',
        'glassboat': 'Book_Glass_Boat'
    };

    const fieldName = expMap[experienceType];
    if (fieldName) {
        const checkbox = document.querySelector(`input[name="${fieldName}"]`);
        if (checkbox) {
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change'));
            
            const card = checkbox.closest('.experience-option-card');
            if (card) {
                card.scrollIntoView({ behavior: 'smooth' });
            }
        }
    } else {
        if (form) form.scrollIntoView({ behavior: 'smooth' });
    }
};

/**
 * Redirects user to the reservations page with query parameters prefilled
 */
window.redirectToReservation = function(experienceName) {
    window.location.href = `Reservation.html?experience=${encodeURIComponent(experienceName)}`;
};
