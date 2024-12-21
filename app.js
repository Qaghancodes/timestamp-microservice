document.getElementById('timestamp-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const dateInput = document.getElementById('date-input').value;

  let url = '/api/timestamp';
  if (dateInput) {
    url += `/${dateInput}`;
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      document.getElementById('unix-result').textContent = data.unix ? data.unix : 'Invalid Date';
      document.getElementById('natural-result').textContent = data.natural ? data.natural : 'Invalid Date';
    })
    .catch(error => {
      console.error(error);
    });
});
