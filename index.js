// timestamp endpoint with no parameter...
app.get("/api/timestamp/", function(req, res) {
  var resDate = new Date();
  res.json({ unix: resDate.valueOf(), utc: resDate.toUTCString() });
});

// normal timestamp endpoint...
app.get("/api/timestamp/:date_string?", function(req, res) {
  var reqString = req.params.date_string;
  var resDate;
  // check to see if the string is a unix timestamp (in this challenge we can just see if it contains a dash as the 5th character), and perform the conversion to an integer if necessary
  if (!/^\d{4}-/.test(reqString)) reqString = parseInt(reqString);
  resDate = new Date(reqString);
  // this comparision is used to see if the date is a valid date, is there another way to do this?
  if (resDate.getTime() !== resDate.getTime()) {
    res.json({ error: "Invalid Date" });
  }
  res.json({ unix: resDate.valueOf(), utc: resDate.toUTCString() });
});