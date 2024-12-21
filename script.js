function getTimestamp() {
  const dateInput = document.getElementById('dateInput').value;
  const resultDiv = document.getElementById('result');
  const unixResult = document.getElementById('unixResult');
  const utcResult = document.getElementById('utcResult');

  // Clear previous results
  unixResult.textContent = '';
  utcResult.textContent = '';

  // Make the API request
  fetch(`/api/${dateInput}`)
      .then(response => response.json())
      .then(data => {
          if (data.error) {
              unixResult.textContent = 'Error: Invalid Date';
              utcResult.textContent = '';
          } else {
              unixResult.textContent = `Unix Timestamp: ${data.unix}`;
              utcResult.textContent = `UTC Time: ${data.utc}`;
          }
      })
      .catch(error => {
          unixResult.textContent = 'Error: Unable to fetch data';
          utcResult.textContent = '';
      });
}
