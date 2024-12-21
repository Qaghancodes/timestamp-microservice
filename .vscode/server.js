const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files (HTML, CSS) from the 'public' folder
app.use(express.static('public'));

// Helper function to return a proper date format (UTC)
const formatDate = (date) => {
  return {
    unix: date.getTime(), // Unix timestamp in milliseconds
    utc: date.toUTCString() // UTC string in the format: Thu, 01 Jan 1970 00:00:00 GMT
  };
};

// Main API Route for timestamp conversion
app.get('/api/:date_string?', (req, res) => {
  let date_string = req.params.date_string;

  // Case 1: No date_string provided, use current date and time
  if (!date_string) {
    let currentDate = new Date();
    return res.json(formatDate(currentDate));
  }

  // Case 2: Try to parse date_string as an ISO 8601 date string or Unix timestamp
  let date = new Date(date_string);

  // If the date is invalid, check if it's a valid Unix timestamp (numeric value)
  if (isNaN(date.getTime())) {
    date = new Date(Number(date_string));
  }

  // Case 3: If the date is still invalid, return error response
  if (isNaN(date.getTime())) {
    return res.json({ error: "Invalid Date" });
  }

  // Return the formatted date response (Unix timestamp and UTC)
  res.json(formatDate(date));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
