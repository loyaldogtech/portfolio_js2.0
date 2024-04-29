//REMOVED in latest Shad's files: document.addEventListener('DOMContentLoaded', function() {
// Declare variables to store the html elements
let historyExist = false;
const getDataBtn = document.getElementById('getDataBtn');
const symbolInput = document.getElementById('symbolInput');
const dateInput = document.getElementById('dateInput');
const stockDataDiv = document.getElementById('stockData');

// Add an event listener to the getDataBtn
getDataBtn.addEventListener('click', function () {
  // Get the value of the symbol and date input fields
  const symbol = symbolInput.value.toUpperCase();
  const date = dateInput.value;
  const apiToken = process.env.STOCK_API_KEY;
  const apiUrl = `https://api.stockdata.org/v1/data/eod?symbols=${symbol}&date=${date}&api_token=${apiToken}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    // Display the stock data on the page
    .then(data => {
      const stock = data.data[0]; // Get the first stock in the array
      // If first search, no history exist and table needs to be built
      if (historyExist === false) {
        stockDataDiv.innerHTML = `
                          <table>
                            <caption>Search Summary</caption>
                            <thead>
                              <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Date</th>
                                <th scope="col">Day Open/Close</th>
                                <th scope="col">Day Low/High</th>
                                <th scope="col">Volume</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td data-label="name">${symbol}</td>
                                <td data-label="date">${date}</td>
                                <td data-label="day-open-close">$${stock.open} / $${stock.close}</td>
                                <td data-label="day-low-high">$${stock.low} / $${stock.high}</td>
                                <td data-label="volume">${stock.volume}</td>
                              </tr>
                            </tbody>
                          </table>
                          <button id="resetBtn">Reset history</button>`;

        const resetButton = document.querySelector('#resetBtn');
        resetButton.addEventListener('click', resetHistory);

        // If not first search, only new row needs to be added  
      } else {
        // Get tbody where the new row will be placed
        const tableBody = document.querySelector('tbody');
        // Create new tr element and all td
        const newTr = document.createElement('tr');
        const tdName = document.createElement('td');
        tdName.setAttribute('data-label', 'name');
        tdName.textContent = `${symbol}`;
        const tdDate = document.createElement('td');
        tdDate.setAttribute('data-label', 'date');
        tdDate.textContent = `${date}`;
        const tdOpenClose = document.createElement('td');
        tdOpenClose.setAttribute('data-label', 'day-open-close');
        tdOpenClose.textContent = `$${stock.open} / $${stock.close}`;
        const tdLowHigh = document.createElement('td');
        tdLowHigh.setAttribute('data-label', 'day-low-high');
        tdLowHigh.textContent = `$${stock.low} / $${stock.high}`;
        const tdVolume = document.createElement('td');
        tdVolume.setAttribute('data-label', 'volume');
        tdVolume.textContent = `${stock.volume}`;

        newTr.insertBefore(tdVolume, newTr.firstChild);
        newTr.insertBefore(tdLowHigh, newTr.firstChild);
        newTr.insertBefore(tdOpenClose, newTr.firstChild);
        newTr.insertBefore(tdDate, newTr.firstChild);
        newTr.insertBefore(tdName, newTr.firstChild);

        // Append to tableBody
        tableBody.insertBefore(newTr, tableBody.firstChild);
        let resetButton = document.querySelector('#resetBtn');
        resetButton.addEventListener('click', resetHistory);
      }
      historyExist = true;

      function resetHistory() {
        window.location.reload();
      }
    })
    .catch(error => {
      stockDataDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    });
});
//REMOVED in latest Shad's files:  });

// 
const yesterday = () => {
  let d = new Date();
  d.setDate(d.getDate() - 2);
  return d;
};

dateInput.max = yesterday().toISOString().split('T')[0];