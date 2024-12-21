const express = require('express');
const app = express();

// Helper function to parse the date and return it in the correct format
function parseDate(dateParam) {
  // Check if the date is a Unix timestamp (i.e., a number)
  if (!isNaN(dateParam)) {
    const date = new Date(parseInt(dateParam)); // Convert string to number and then to Date
    if (date.toString() === 'Invalid Date') {
      return null; // Return null if the date is invalid
    }
    return date;
  }

  // Check if it's a valid date string (can be a standard date string or ISO format)
  const date = new Date(dateParam);
  if (date.toString() === 'Invalid Date') {
    return null; // Return null if the date is invalid
  }

  return date;
}

// Route to handle requests for /api/:date
app.get('/api/:date?', (req, res) => {
  const { date } = req.params;

  // If no date is provided, return the current date and time
  if (!date) {
    const currentDate = new Date();
    return res.json({
      unix: currentDate.getTime(),
      utc: currentDate.toUTCString(),
    });
  }

  // Parse the provided date (could be a Unix timestamp or a string)
  const parsedDate = parseDate(date);

  // If the date is invalid, return an error message
  if (!parsedDate) {
    return res.json({ error: 'Invalid Date' });
  }

  // Return the Unix timestamp and UTC string for valid dates
  res.json({
    unix: parsedDate.getTime(),
    utc: parsedDate.toUTCString(),
  });
});

// Start the server on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

