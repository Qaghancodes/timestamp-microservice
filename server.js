const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the public folder (frontend assets like HTML, JS, CSS)
app.use(express.static('public'));

// Helper function to format date to Unix and UTC
function formatDate(date) {
    const utcString = date.toUTCString();
    const unixTimestamp = date.getTime();
    return {
        unix: unixTimestamp,
        utc: utcString
    };
}

// API route to handle both valid and invalid date inputs
app.get('/api/:date?', (req, res) => {
    const { date } = req.params;

    // If no date is provided, return the current date/time
    if (!date) {
        const currentDate = new Date();
        return res.json(formatDate(currentDate));
    }

    let parsedDate;

    // If the date is a number, assume it's a Unix timestamp
    if (!isNaN(date)) {
        parsedDate = new Date(parseInt(date));
    } else {
        // Try parsing as a standard date string
        parsedDate = new Date(date);
    }

    // If the date is invalid, return an error
    if (parsedDate.toString() === 'Invalid Date') {
        return res.json({ error: 'Invalid Date' });
    }

    // Return the formatted date (Unix timestamp and UTC)
    return res.json(formatDate(parsedDate));
});

// Start the server and listen for requests on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
