const transactionUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const igrejaValueDisplay = document.querySelector('#igreja-value');
const matrizValueDisplay = document.querySelector('#matriz-value');
const prebendaValueDisplay = document.querySelector('#prebenda-value');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

const removeTransaction = ID => {
  transactions = transactions.filter(transaction => transaction.id !== ID);
  updateLocalStorage();
  init();
};

const addTransactionIntoDOM = transaction => {
  const operator = transaction.amount < 0 ? '-' : '+';
  const CSSClass = transaction.amount < 0 ? 'minus' : 'plus';
  const amountWithoutOperator = Math.abs(transaction.amount);
  const li = document.createElement('li');

  li.classList.add(CSSClass);
  li.innerHTML = `
    ${transaction.name} 
    <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
      x
    </button>
  `;
  transactionUl.prepend(li);
};

const updateBalanceValues = () => {
  const transactionsAmounts = transactions.map(transaction => transaction.amount);
  const total = transactionsAmounts.reduce((accumulator, transaction) => accumulator + transaction, 0).toFixed(2);
  const income = transactionsAmounts.filter(value => value > 0).reduce((accumulator, value) => accumulator + value, 0).toFixed(2);
  const expense = Math.abs(transactionsAmounts.filter(value => value < 0).reduce((accumulator, value) => accumulator + value, 0)).toFixed(2);

  balanceDisplay.textContent = `R$ ${total}`;
  incomeDisplay.textContent = `R$ ${income}`;
  expenseDisplay.textContent = `R$ ${expense}`;

  updateFractionValues(total);
};

const updateFractionValues = (total) => {
  const totalAmount = parseFloat(total);
  const igrejaValue = (totalAmount * 0.50).toFixed(2);
  const matrizValue = (totalAmount * 0.10).toFixed(2);
  const prebendaValue = (totalAmount * 0.40).toFixed(2);

  igrejaValueDisplay.textContent = `R$ ${igrejaValue}`;
  matrizValueDisplay.textContent = `R$ ${matrizValue}`;
  prebendaValueDisplay.textContent = `R$ ${prebendaValue}`;
};

const init = () => {
  transactionUl.innerHTML = '';
  transactions.forEach(addTransactionIntoDOM);
  updateBalanceValues();
};

init();

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions));
};

const generateID = () => Math.round(Math.random() * 1000);

form.addEventListener('submit', event => {
  event.preventDefault();

  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();

  if (transactionName === '' || transactionAmount === '') {
    alert('Por favor, preencha nome e valor da transação');
    return;
  }

  const transaction = { 
    id: generateID(), 
    name: transactionName, 
    amount: Number(transactionAmount)
  };

  transactions.push(transaction);
  init();
  updateLocalStorage();

  inputTransactionName.value = '';
  inputTransactionAmount.value = '';
});

const ctx = document.getElementById('pieChart').getContext('2d');
let pieChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Receitas', 'Despesas'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#2ecc71', '#c0392b'],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false
  }
});

function updatePieChart(income, expense) {
  pieChart.data.datasets[0].data = [income, expense];
  pieChart.update();
}

function displayPositiveTransactions() {
  const positiveTransactionsUl = document.querySelector('#positive-transactions');
  positiveTransactionsUl.innerHTML = '';

  const positiveTransactions = transactions.filter(transaction => transaction.amount > 0);
  positiveTransactions.forEach(transaction => {
    const li = document.createElement('li');
    li.classList.add('plus');
    li.innerHTML = `${transaction.name} <span>R$ ${transaction.amount.toFixed(2)}</span>`;
    positiveTransactionsUl.appendChild(li);
  });
}

function displayNegativeTransactions() {
  const negativeTransactionsUl = document.querySelector('#negative-transactions');
  negativeTransactionsUl.innerHTML = '';

  const negativeTransactions = transactions.filter(transaction => transaction.amount < 0);
  let totalGastos = 0;
  negativeTransactions.forEach(transaction => {
    const li = document.createElement('li');
    li.classList.add('minus');
    li.innerHTML = `${transaction.name} <span>R$ ${Math.abs(transaction.amount).toFixed(2)}</span>`;
    negativeTransactionsUl.appendChild(li);
    totalGastos += Math.abs(transaction.amount);
  });

  const igrejaValue = parseFloat(document.querySelector('#igreja-value').textContent.replace('R$', '').trim());
  document.querySelector('#igreja-total').textContent = `R$ ${igrejaValue.toFixed(2)}`;
  document.querySelector('#gastos-total').textContent = `R$ ${totalGastos.toFixed(2)}`;
  document.querySelector('#remaining-balance').textContent = `R$ ${(igrejaValue - totalGastos).toFixed(2)}`;
}

