// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// API endpoint to handle date request
app.get("/api/:date?", function (req, res) {
  const inputDate = req.params.date;
  let date;

  if (!inputDate) {
    date = new Date();  // If no date is provided, return the current date and time
  } else {
    // If the input is a valid Unix timestamp
    if (/^\d{13}$/.test(inputDate)) {
      date = new Date(parseInt(inputDate));  // Parse Unix timestamp in milliseconds
    } else {
      date = new Date(inputDate);  // Otherwise, try to parse it as a regular date string
    }
  }

  if (date.toString() === 'Invalid Date') {
    res.json({ error: "Invalid Date" });  // If the date is invalid, return an error
  } else {
    res.json({
      unix: date.getTime(),  // Unix timestamp in milliseconds
      utc: date.toUTCString()  // UTC date string
    });
  }
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
