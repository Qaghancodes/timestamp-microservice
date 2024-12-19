const express = require('express');
const router = express.Router();

// API endpoint to handle date requests
router.get('/:date?', (req, res) => {
    const dateParam = req.params.date;

    let date;
    if (dateParam) {
        // Check if the date is a valid Unix timestamp
        if (!isNaN(dateParam)) {
            date = new Date(parseInt(dateParam)); // Unix timestamp to Date object
        } else {
            // Try parsing it as a string (Date object)
            date = new Date(dateParam);
        }
    } else {
        date = new Date();
    }

    // Check if date is valid
    if (date instanceof Date && !isNaN(date)) {
        // Convert to Unix timestamp and UTC date
        res.json({
            unix: date.getTime(),
            utc: date.toUTCString(),
        });
    } else {
        // Invalid date
        res.json({ error: 'Invalid Date' });
    }
});

module.exports = router;