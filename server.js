// Here we include both the server logic and instructions in a single script for you
const fs = require('fs');
const express = require('express');
const app = express();

// Helper function to handle the date and return a valid Date object
function parseDate(dateParam) {
  // If the dateParam is a Unix timestamp (numeric string), we convert it to a Date object
  if (!isNaN(dateParam)) {
    const date = new Date(parseInt(dateParam)); // Convert string to number, then to a Date object
    if (date.toString() === 'Invalid Date') {
      return null; // Return null for invalid date
    }
    return date;
  }

  // Otherwise, try to parse it as a regular date string (e.g., "2024-12-21")
  const date = new Date(dateParam);
  if (date.toString() === 'Invalid Date') {
    return null; // Return null for invalid date
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

  // If the date is invalid, return an error
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

// Check if package.json exists
const packageJsonContent = `
{
  "name": "timestamp-microservice",
  "version": "1.0.0",
  "description": "A timestamp microservice to handle both Unix and UTC format requests",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "author": "Your Name",
  "license": "ISC",
  "engines": {
    "node": ">=14.0.0"
  }
}
`;

// Write package.json content to a file (if it doesn't already exist)
if (!fs.existsSync('./package.json')) {
  fs.writeFileSync('./package.json', packageJsonContent, 'utf8');
  console.log('package.json has been created');
} else {
  console.log('package.json already exists');
}
