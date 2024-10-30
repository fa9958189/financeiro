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

// Carregar transações do armazenamento local ou inicializar vazio
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Remove transação pelo ID
const removeTransaction = ID => {
    transactions = transactions.filter(transaction => transaction.id !== ID);
    updateLocalStorage();
    init();
};

// Adiciona transação ao DOM
const addTransactionIntoDOM = transaction => {
    const operator = transaction.amount < 0 ? '-' : '+';
    const CSSClass = transaction.amount < 0 ? 'minus' : 'plus';
    const amountWithoutOperator = Math.abs(transaction.amount);
    const li = document.createElement('li');

    li.classList.add(CSSClass);
    li.innerHTML = `
        ${transaction.name} <span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransaction(${transaction.id})">x</button>
    `;
    transactionUl.append(li);
};

// Atualiza o saldo, receitas e despesas no display
const updateBalanceValues = () => {
    const transactionsAmounts = transactions.map(transaction => transaction.amount);
    const total = transactionsAmounts.reduce((acc, transaction) => acc + transaction, 0).toFixed(2);
    const income = transactionsAmounts.filter(value => value > 0)
        .reduce((acc, value) => acc + value, 0).toFixed(2);
    const expense = Math.abs(transactionsAmounts.filter(value => value < 0)
        .reduce((acc, value) => acc + value, 0)).toFixed(2);

    balanceDisplay.textContent = `R$ ${total}`;
    incomeDisplay.textContent = `+ R$ ${income}`;
    expenseDisplay.textContent = `- R$ ${expense}`;

    igrejaValueDisplay.textContent = `R$ ${(total * 0.50).toFixed(2)}`;
    matrizValueDisplay.textContent = `R$ ${(total * 0.10).toFixed(2)}`;
    prebendaValueDisplay.textContent = `R$ ${(total * 0.40).toFixed(2)}`;
};

// Função de inicialização
const init = () => {
    if (transactionUl) {
        transactionUl.innerHTML = '';
        transactions.forEach(addTransactionIntoDOM);
    }
    updateBalanceValues();
};

// Atualiza transações no armazenamento local
const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
};

// Gera ID único para cada transação
const generateID = () => Math.round(Math.random() * 1000);

// Evento de envio de formulário para adicionar transação
if (form) {
    form.addEventListener('submit', event => {
        event.preventDefault();

        const transactionName = inputTransactionName.value.trim();
        const transactionAmount = inputTransactionAmount.value.trim();

        if (transactionName === '' || transactionAmount === '') {
            alert('Por favor, preencha o nome e o valor da transação.');
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
}

// Função para fechar o mês e armazenar dados do fechamento
const fecharMes = () => {
    const mesAno = prompt("Digite o mês e ano do fechamento (ex: Janeiro 2024):");
    if (!mesAno) return;

    const totalBalance = parseFloat(balanceDisplay.textContent.replace('R$', '').replace(',', '.').trim());

    const dizimistas = transactions.filter(trans => trans.amount > 0);
    const gastos = transactions.filter(trans => trans.amount < 0);
    const totalGastos = gastos.reduce((sum, trans) => sum + Math.abs(trans.amount), 0).toFixed(2);
    const igrejaValue = (totalBalance * 0.50).toFixed(2);
    const matrizValue = (totalBalance * 0.10).toFixed(2);
    const prebendaValue = (totalBalance * 0.40).toFixed(2);
    const saldoIgreja = (igrejaValue - totalGastos).toFixed(2);

    const fechamentoData = {
        mesAno,
        dizimistas,
        gastos,
        igrejaValue,
        matrizValue,
        prebendaValue,
        totalGastos,
        saldoIgreja,
    };

    const fechamentos = JSON.parse(localStorage.getItem('fechamentos')) || [];
    fechamentos.push(fechamentoData);
    localStorage.setItem('fechamentos', JSON.stringify(fechamentos));

    // Limpa transações após salvar o fechamento
    transactions = [];
    updateLocalStorage();
    init(); // Atualiza o DOM para refletir a lista vazia

    alert(`Fechamento de ${mesAno} realizado com sucesso e transações limpas!`);
};

// Botão para fechar o mês, caso esteja na página principal
if (document.getElementById('fechar-mes-btn')) {
    document.getElementById('fechar-mes-btn').addEventListener('click', fecharMes);
}

// Função para carregar fechamentos no fechamento.html
const carregarFechamentos = () => {
    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const calendar = document.getElementById('calendar');
    if (!calendar) return; // Evita erro se não estiver no fechamento.html

    const fechamentos = JSON.parse(localStorage.getItem('fechamentos')) || [];

    meses.forEach((mes, index) => {
        const mesAno = `${mes} 2024`;
        const fechamento = fechamentos.find(f => f.mesAno === mesAno);

        const monthDiv = document.createElement('div');
        monthDiv.classList.add('month');
        monthDiv.classList.add(fechamento ? 'closed' : 'open');
        monthDiv.textContent = mes;
        monthDiv.addEventListener('click', () => {
            if (fechamento) {
                exibirDetalhesFechamento(fechamento);
            } else {
                alert(`${mesAno} ainda está aberto.`);
            }
        });

        const status = document.createElement('p');
        status.textContent = fechamento ? 'Fechado' : 'Aberto';
        monthDiv.appendChild(status);

        calendar.appendChild(monthDiv);
    });
};

// Função para exibir detalhes do fechamento
const exibirDetalhesFechamento = (fechamento) => {
    document.getElementById('igreja-distribuicao').textContent = `Igreja (50%): R$ ${fechamento.igrejaValue}`;
    document.getElementById('matriz-distribuicao').textContent = `Matriz (10%): R$ ${fechamento.matrizValue}`;
    document.getElementById('prebenda-distribuicao').textContent = `Prebenda (40%): R$ ${fechamento.prebendaValue}`;
    document.getElementById('total-gastos').textContent = `Total de Gastos: R$ ${fechamento.totalGastos}`;
    document.getElementById('saldo-igreja').textContent = `Saldo da Igreja: R$ ${fechamento.saldoIgreja}`;

    const dizimistasList = document.getElementById('fechamento-dizimistas');
    dizimistasList.innerHTML = '';
    fechamento.dizimistas.forEach(trans => {
        const li = document.createElement('li');
        li.textContent = `${trans.name}: R$ ${trans.amount.toFixed(2)}`;
        dizimistasList.appendChild(li);
    });

    const gastosList = document.getElementById('fechamento-gastos');
    gastosList.innerHTML = '';
    fechamento.gastos.forEach(trans => {
        const li = document.createElement('li');
        li.textContent = `${trans.name}: R$ ${Math.abs(trans.amount).toFixed(2)}`;
        gastosList.appendChild(li);
    });
};

// Função para carregar transações positivas em dizimista.html
const carregarDizimistas = () => {
    const dizimistasUl = document.getElementById('positive-transactions');
    if (!dizimistasUl) return; // Evita erro se não estiver no dizimista.html

    const dizimistas = transactions.filter(trans => trans.amount > 0);
    dizimistas.forEach(trans => {
        const li = document.createElement('li');
        li.textContent = `${trans.name}: R$ ${trans.amount.toFixed(2)}`;
        dizimistasUl.appendChild(li);
    });
};

// Inicializa a aplicação ao carregar a página
init();

 // Dados para o gráfico de pizza
 const ctx = document.getElementById('graficoPizza').getContext('2d');
 const graficoPizza = new Chart(ctx, {
     type: 'pie',
     data: {
         labels: ['Igreja', 'Matriz', 'Prebenda'],
         datasets: [{
             data: [50, 10, 40],
             backgroundColor: ['#4CAF50', '#FFC107', '#FF5722']
         }]
     },
     options: {
         responsive: true,
         plugins: {
             legend: {
                 position: 'top',
             },
             tooltip: {
                 callbacks: {
                     label: function(context) {
                         return `${context.label}: ${context.raw}%`;
                     }
                 }
             }
         }
     }
 });

 // Função para adicionar transações (exemplo)
 function adicionarTransacao(nome, valor) {
     const lista = document.getElementById('lista-transacoes');
     const item = document.createElement('li');
     item.textContent = `${nome}: R$ ${valor}`;
     lista.appendChild(item);
 }

 // Função para limpar transações ao fechar o mês
 document.getElementById('fechar-mes').addEventListener('click', function() {
     const lista = document.getElementById('lista-transacoes');
     lista.innerHTML = ''; // Limpa a lista de transações
     alert('Mês fechado e transações limpas.');
 });

 // Exemplo de transações
 adicionarTransacao('Dízimo', -100);
 adicionarTransacao('Oferta', -200);