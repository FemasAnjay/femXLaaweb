const apiURL = 'https://api.coingecko.com/api/v3/coins/markets';
const currencySelector = document.getElementById('currency');
const tableBody = document.querySelector('#crypto-data tbody');

// Fetch Crypto Data
async function fetchCryptoData(currency = 'usd') {
  const response = await fetch(`${apiURL}?vs_currency=${currency}&order=market_cap_desc&per_page=10&page=1&sparkline=false`);
  const data = await response.json();
  renderTable(data);
}

// Render Table
function renderTable(data) {
  tableBody.innerHTML = '';
  data.forEach((coin, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td><img src="${coin.image}" alt="${coin.name}" width="20"> ${coin.name} (${coin.symbol.toUpperCase()})</td>
        <td>$${coin.current_price.toLocaleString()}</td>
        <td>${coin.price_change_percentage_24h.toFixed(2)}%</td>
        <td>$${coin.market_cap.toLocaleString()}</td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

// Event Listener for Currency Change
currencySelector.addEventListener('change', (e) => {
  fetchCryptoData(e.target.value);
});

// Initial Fetch
fetchCryptoData();