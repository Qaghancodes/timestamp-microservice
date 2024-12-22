app.get("/api/:date?", (req, res) => {
  const date_string = req.params.date;
  let date;
  let unix;
  let utc;

  if (!date_string) {
    date = new Date();  // Current date and time
  } else if (/^\d{5,}$/.test(date_string)) {
    date = new Date(parseInt(date_string));  // Unix timestamp
  } else {
    date = new Date(date_string);  // Date string (e.g., "YYYY-MM-DD")
  }

  // Check if the date is valid
  if (!isNaN(date)) {
    unix = date.getTime();
    utc = date.toUTCString();
    res.json({ unix, utc });
  } else {
    res.json({ error: "Invalid Date" });  // Return error for invalid date
  }
});
