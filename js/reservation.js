/**
 * Reservation Page Logic
 * Handles experience selection, form toggles, price calculation, and deep-linking
 */

document.addEventListener('DOMContentLoaded', function() {
    // 1. Handle Experience Toggles and Price Calculation
    const form = document.getElementById('reservation-form');
    if (form) {
        const toggles = form.querySelectorAll('.experience-toggle');
        const priceDisplay = document.getElementById('price-display');
        const guestInputs = form.querySelectorAll('.guest-input');
        
        function calculateTotal() {
            let total = 0;
            toggles.forEach(toggle => {
                if (toggle.checked) {
                    const price = parseFloat(toggle.dataset.price);
                    const targetId = toggle.dataset.target;
                    const detailsDiv = document.getElementById(targetId);
                    const guests = parseInt(detailsDiv.querySelector('.guest-input').value) || 0;
                    total += price * guests;
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
                
                if (this.checked) {
                    detailsDiv.classList.remove('collapsed');
                } else {
                    detailsDiv.classList.add('collapsed');
                }
                calculateTotal();
            });
        });

        guestInputs.forEach(input => {
            input.addEventListener('input', calculateTotal);
        });

        // Initial calculation
        calculateTotal();
    }

    // 2. Handle Query Parameters for Pre-selection
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
            'Historic Walking Tour': 'Book_Walking_Tour'
        };

        const fieldName = expMap[experienceParam] || expMap[decodeURIComponent(experienceParam)];
        if (fieldName) {
            const checkbox = document.querySelector(`input[name="${fieldName}"]`);
            if (checkbox) {
                checkbox.checked = true;
                // Trigger change event to show details
                checkbox.dispatchEvent(new Event('change'));
                // Scroll to the form
                setTimeout(() => {
                    checkbox.closest('.experience-option-card').scrollIntoView({ behavior: 'smooth' });
                }, 500);
            }
        }
    }

    // 3. FAQ Toggles
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
});

/**
 * Global function to open form for a specific experience on the reservation page
 */
window.openForm = function(experienceType) {
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
            checkbox.closest('.experience-option-card').scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        // Just scroll to form if type not found
        const form = document.getElementById('reservation-form');
        if (form) form.scrollIntoView({ behavior: 'smooth' });
    }
};

/**
 * Global function to redirect to reservation page with experience pre-selected
 */
window.redirectToReservation = function(experienceName) {
    window.location.href = `Reservation.html?experience=${encodeURIComponent(experienceName)}`;
};
