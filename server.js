let express = require('express');
const app = express();

// Helper function to handle date parsing
function parseDate(dateParam) {
  // Check if the input is a valid Unix timestamp (numeric string)
  if (!isNaN(dateParam)) {
    const date = new Date(parseInt(dateParam));
    if (date.toString() === 'Invalid Date') {
      return null;  // Return null for invalid date
    }
    return date;
  }

  // Otherwise, try to parse it as a regular date string
  const date = new Date(dateParam);
  if (date.toString() === 'Invalid Date') {
    return null;  // Return null if invalid
  }

  return date;
}

// Define the route for handling requests
app.get('/api/:date?', (req, res) => {
  const { date } = req.params;

  // If no date is provided, return the current date
  if (!date) {
    const currentDate = new Date();
    return res.json({
      unix: currentDate.getTime(),
      utc: currentDate.toUTCString(),
    });
  }

  // Parse the provided date (could be a Unix timestamp or string)
  const parsedDate = parseDate(date);

  // If date parsing fails, return an error
  if (!parsedDate) {
    return res.json({ error: 'Invalid Date' });
  }

  // Return the Unix and UTC formats
  res.json({
    unix: parsedDate.getTime(),
    utc: parsedDate.toUTCString(),
  });
});

// Start the server
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
