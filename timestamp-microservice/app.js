app.get("/api/:date?", (req, res) => {
  // Extract the date_string parameter from the URL
  const date_string = req.params.date;

  // Initialize variables for date, unix, and utc
  let date;
  let unix;
  let utc;

  // **Case 1**: If date_string is empty, set it to the current date and time
  if (!date_string) {
    date = new Date();
  }

  // **Case 2**: Check if date_string is a Unix timestamp in milliseconds
  else if (/^\d{5,}$/.test(date_string)) {
    date = new Date(parseInt(date_string));
  }

  // **Case 3**: Assume date_string is a date in the format "YYYY-MM-DD"
  else {
    date = new Date(date_string);

    // Check if the parsed date corresponds to the input
    const inputDate = date_string.split('-').map(Number); // Split the input date string
    const parsedYear = date.getFullYear();
    const parsedMonth = date.getMonth() + 1; // JavaScript months are 0-based

    if (
      inputDate[0] !== parsedYear ||
      inputDate[1] !== parsedMonth ||
      inputDate[2] !== date.getDate()
    ) {
      // The parsed date does not match the input, so it's invalid
      res.json({ error: "Invalid Date" });
      return;
    }
  }

  if (!isNaN(date)) {
    // If the date is valid, set the unix and utc values
    unix = date.getTime();
    utc = date.toUTCString();

    // Send a JSON response with the unix and utc values
    res.json({ unix, utc });
  } else {
    // **Case 4**: Trigger an error message when the input is not a valid date
    res.json({ error: "Invalid Date" });
  }
});