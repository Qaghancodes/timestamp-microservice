const express = require('express');
const router = express.Router();

// Route to serve the homepage
router.get('/', (req, res) => {
    res.render('index', { title: 'Timestamp Microservice' });
});

// API route to handle date/timestamp requests
router.get('/api/:date_string?', (req, res) => {
    const { date_string } = req.params;

    let date;

    // If a date is provided, use it, otherwise use the current date
    if (date_string) {
        if (/^\d+$/.test(date_string)) {
            // If it's a Unix timestamp (number)
            date = new Date(parseInt(date_string));
        } else {
            // Otherwise, treat it as a string date
            date = new Date(date_string);
        }
    } else {
        // Default to the current date
        date = new Date();
    }

    if (date.getTime()) {
        // Valid date
        const unix = date.getTime();
        const utc = date.toUTCString();
        res.json({ unix, utc });
    } else {
        // Invalid date
        res.json({ error: "Invalid Date" });
    }
});

module.exports = router;