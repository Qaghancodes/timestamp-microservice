// app.js or server.js (or the name of your server file)

// Import express
const express = require('express');

// Initialize the app
const app = express();

// Define the port to run the server on
const port = process.env.PORT || 3000;

// Route handling
app.get('/api/:date?', (req, res) => {
    const dateInput = req.params.date;

    // If no date is provided, return the current date
    if (!dateInput) {
        const currentDate = new Date();
        return res.json({
            unix: currentDate.getTime(),
            utc: currentDate.toUTCString()
        });
    }

    // Check if the date is a valid Unix timestamp
    let date = new Date(isNaN(dateInput) ? dateInput : parseInt(dateInput));

    // If the date is invalid, return error
    if (date.toString() === 'Invalid Date') {
        return res.json({ error: 'Invalid Date' });
    }

    // Return the Unix timestamp and UTC date
    res.json({
        unix: date.getTime(),
        utc: date.toUTCString()
    });
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});