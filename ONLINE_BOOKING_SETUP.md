# Online Cooking Class Booking System - Setup Guide

## Overview

This booking system provides a dedicated calendar-based interface for guests to browse and book your online cooking classes. It features:

- **Interactive Calendar**: Browse available classes by month or list view
- **Event Details**: View cooking menu, date, time, Zoom link, and description
- **Booking Form**: Capture guest information including dietary restrictions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Files Created

### 1. **online-booking.html**
The main booking page with integrated calendar and event details display.

**Location**: `/home/ubuntu/Suhaila-locals/online-booking.html`

**Features**:
- FullCalendar integration for event display
- Real-time event details sidebar
- Modal-based booking form
- Responsive two-column layout (calendar + details)

### 2. **data/online-classes.json**
JSON data file containing all online cooking class events.

**Location**: `/home/ubuntu/Suhaila-locals/data/online-classes.json`

**Structure**:
```json
{
  "id": "unique-id",
  "title": "Class Name",
  "start": "ISO-8601 datetime",
  "end": "ISO-8601 datetime",
  "extendedProps": {
    "menu": "Comma-separated menu items",
    "zoomLink": "https://zoom.us/j/...",
    "price": "20 USD",
    "description": "Class description"
  }
}
```

### 3. **js/online-booking.js** (Optional)
Standalone JavaScript file for managing the booking system (included in HTML but can be separated).

**Location**: `/home/ubuntu/Suhaila-locals/js/online-booking.js`

## Setup Instructions

### Step 1: Update Your Navigation
Add a link to the booking page in your navigation menu. Edit `cookingclass-online.html`:

```html
<a href="online-booking.html" class="button-cta">Browse & Book Classes</a>
```

Or update the sidebar booking button:

```html
<a href="online-booking.html" class="button-cta">View Calendar & Book</a>
```

### Step 2: Configure Formspree Integration
The booking form submits to Formspree. You need to:

1. Go to [formspree.io](https://formspree.io)
2. Create a new form or use an existing one
3. Copy your form endpoint (e.g., `https://formspree.io/f/xyzabc123`)
4. Replace the placeholder in `online-booking.html` (line ~520):

```javascript
fetch('https://formspree.io/f/YOUR_FORM_ID', {
```

### Step 3: Add Your Classes
Edit `data/online-classes.json` to add your cooking classes:

```json
{
  "id": "class-1",
  "title": "Hummus & Falafel Workshop",
  "start": "2026-03-15T18:00:00",
  "end": "2026-03-15T20:00:00",
  "extendedProps": {
    "menu": "Creamy Hummus, Crispy Falafel, Tahini Sauce",
    "zoomLink": "https://zoom.us/j/your-meeting-id",
    "price": "20 USD",
    "description": "Learn the secrets to perfect street food at home."
  }
}
```

**Important**: Use ISO-8601 format for dates: `YYYY-MM-DDTHH:MM:SS`

### Step 4: Test the System
1. Navigate to `online-booking.html` in your browser
2. Click on a class in the calendar
3. Verify event details display correctly
4. Click "Book This Class" and fill out the form
5. Submit and verify the email is received

## Customization Guide

### Change Colors
Edit the CSS in `online-booking.html` to match your brand:

```css
.price-display {
  background: linear-gradient(135deg, #YOUR_COLOR 0%, #YOUR_COLOR_DARK 100%);
}

.booking-button {
  background: linear-gradient(135deg, #YOUR_COLOR 0%, #YOUR_COLOR_DARK 100%);
}
```

### Modify Form Fields
To add or remove form fields, edit the form section in `online-booking.html`:

```html
<div class="form-group">
  <label for="fieldId">Label Text</label>
  <input type="text" id="fieldId" name="field_name" required>
</div>
```

### Change Calendar View
Modify the `headerToolbar` in the `initializeCalendar()` function:

```javascript
headerToolbar: {
  left: 'prev,next today',
  center: 'title',
  right: 'dayGridMonth,listMonth,dayGridWeek' // Add more views
}
```

### Add More Classes
Simply add more objects to `data/online-classes.json`:

```json
[
  { /* existing class */ },
  { /* new class */ }
]
```

## Integration with Existing Booking System

This system works **alongside** your existing `Reservation.html` form. You can:

1. Keep the generic reservation form for other experiences
2. Use this specialized calendar booking for online classes only
3. Both systems can send to the same Formspree endpoint

To send both to the same email, ensure both forms have the same Formspree endpoint.

## Email Notifications

When a guest books a class, Formspree will send you an email with:
- Guest name, email, and phone
- Number of participants
- Selected class and date/time
- Any dietary restrictions or special notes

## Mobile Responsiveness

The system is fully responsive:
- **Desktop**: Two-column layout (calendar + details)
- **Tablet**: Stacked layout with full-width sections
- **Mobile**: Single-column, optimized touch interactions

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

## Troubleshooting

### Calendar not loading?
- Check that `data/online-classes.json` exists and is valid JSON
- Open browser console (F12) to check for errors
- Verify the fetch URL is correct

### Form not submitting?
- Check that you've updated the Formspree endpoint
- Verify all required fields are filled
- Check browser console for network errors

### Styling issues?
- Clear browser cache (Ctrl+Shift+Delete)
- Verify `style.css` is loaded
- Check for CSS conflicts with existing styles

## Future Enhancements

Consider adding:
- Email reminders before class
- Automatic Zoom link distribution
- Payment integration
- Class capacity management
- Cancellation/rescheduling options
- Guest reviews and ratings

## Support

For questions or issues:
- Email: suhaila.cook@gmail.com
- Check the browser console for error messages
- Verify all file paths are correct

---

**Version**: 1.0  
**Last Updated**: February 2026  
**Compatibility**: All modern browsers
