const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Helper function to format date into Unix timestamp and UTC string
const formatDate = (date) => {
  return {
    unix: date.getTime(), // Unix timestamp in milliseconds
    utc: date.toUTCString() // UTC formatted date string
  };
};

// Main API Route
app.get('/api/:date_string?', (req, res) => {
  let date_string = req.params.date_string;

  // Case 1: No date string provided, use current date and time
  if (!date_string) {
    let currentDate = new Date();
    return res.json(formatDate(currentDate));
  }

  // Case 2: Try to parse the date string as a valid date
  let date = new Date(date_string);

  // Case 3: Check if date is a valid Unix timestamp (number)
  if (isNaN(date.getTime())) {
    date = new Date(Number(date_string));
  }

  // Case 4: If both parsing attempts failed, return an error
  if (isNaN(date.getTime())) {
    return res.json({ error: "Invalid Date" });
  }

  // Return formatted date (Unix timestamp and UTC string)
  res.json(formatDate(date));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
