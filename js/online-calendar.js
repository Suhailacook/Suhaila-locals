/* Interactive date calendar for the online Hummus & Falafel class. */
(function () {
    'use strict';

    const daysElement = document.getElementById('calendar-days');
    const monthElement = document.getElementById('calendar-month');
    const previousButton = document.getElementById('calendar-prev');
    const nextButton = document.getElementById('calendar-next');
    const selectionElement = document.getElementById('calendar-selection');
    const dateInput = document.getElementById('bookingDate');
    const timeInput = document.getElementById('bookingTime');

    if (!daysElement || !monthElement || !previousButton || !nextButton || !dateInput) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = toKey(today);
    let viewDate = new Date(today.getFullYear(), today.getMonth(), 1);

    dateInput.min = todayKey;

    function toKey(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function fromKey(value) {
        const [year, month, day] = value.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    function announceSelection() {
        if (!dateInput.value) {
            selectionElement.textContent = 'Select a date to continue.';
            return;
        }
        const date = fromKey(dateInput.value);
        const label = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(date);
        const timeLabel = timeInput && timeInput.value ? ` at ${timeInput.value} (Aqaba time)` : '';
        selectionElement.textContent = `Preferred date: ${label}${timeLabel}`;
    }

    function render() {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        monthElement.textContent = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(viewDate);
        daysElement.innerHTML = '';

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const selectedKey = dateInput.value;

        for (let index = 0; index < firstDay; index += 1) {
            const spacer = document.createElement('span');
            spacer.className = 'calendar-day calendar-day-empty';
            spacer.setAttribute('aria-hidden', 'true');
            daysElement.appendChild(spacer);
        }

        for (let day = 1; day <= daysInMonth; day += 1) {
            const date = new Date(year, month, day);
            const key = toKey(date);
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'calendar-day';
            button.textContent = day;
            button.setAttribute('role', 'gridcell');
            button.setAttribute('aria-label', new Intl.DateTimeFormat('en', { dateStyle: 'full' }).format(date));

            if (key < todayKey) {
                button.disabled = true;
                button.classList.add('calendar-day-past');
            } else {
                button.addEventListener('click', () => {
                    dateInput.value = key;
                    dateInput.dispatchEvent(new Event('change', { bubbles: true }));
                    render();
                    announceSelection();
                });
            }

            if (key === todayKey) button.classList.add('calendar-day-today');
            if (key === selectedKey) {
                button.classList.add('calendar-day-selected');
                button.setAttribute('aria-selected', 'true');
            }
            daysElement.appendChild(button);
        }

        const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        previousButton.disabled = viewDate <= firstOfMonth;
        announceSelection();
    }

    previousButton.addEventListener('click', () => {
        if (previousButton.disabled) return;
        viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
        render();
    });

    nextButton.addEventListener('click', () => {
        viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
        render();
    });

    dateInput.addEventListener('change', () => {
        if (dateInput.value) {
            const selected = fromKey(dateInput.value);
            if (selected >= today) viewDate = new Date(selected.getFullYear(), selected.getMonth(), 1);
        }
        render();
    });

    if (timeInput) timeInput.addEventListener('change', announceSelection);
    render();
})();
