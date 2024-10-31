// src/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import Chart from 'chart.js/auto'; // Certifique-se de ter o Chart.js instalado

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    setTransactions(storedTransactions);
    calcularSaldo(storedTransactions);
  }, []);

  const calcularSaldo = (trans) => {
    const total = trans.reduce((acc, curr) => acc + curr.amount, 0);
    setBalance(total);
    setIncome(trans.filter(t => t.amount > 0).reduce((acc, curr) => acc + curr.amount, 0));
    setExpense(trans.filter(t => t.amount < 0).reduce((acc, curr) => acc + curr.amount, 0));
  };

  const adicionarTransacao = (event) => {
    event.preventDefault();
    const name = event.target.text.value;
    const amount = parseFloat(event.target.amount.value);
    const newTransaction = { name, amount };
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    calcularSaldo(updatedTransactions);
    event.target.reset();
  };

  return (
    <div>
      <h2>Controle de despesas</h2>

      <Link to="/dizimistas" className="btn">Ver Dizimistas</Link>
      <Link to="/gastos" className="btn">Ver Gastos</Link>
      <Link to="/fechamento" className="btn">Ver Fechamentos</Link>

      <div className="container">
        <h4>Saldo atual</h4>
        <h1 id="balance" className="balance">R$ {balance.toFixed(2)}</h1>

        <h3>Fracionamento</h3>
        <table className="fraction-table">
          <tbody>
            <tr>
              <th>Igreja (50%)</th>
              <th>Matriz (10%)</th>
              <th>Prebenda (40%)</th>
            </tr>
            <tr>
              <td id="igreja-value" className="fraction-value">R$ {(balance * 0.5).toFixed(2)}</td>
              <td id="matriz-value" className="fraction-value">R$ {(balance * 0.1).toFixed(2)}</td>
              <td id="prebenda-value" className="fraction-value">R$ {(balance * 0.4).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div className="inc-exp-container">
          <div>
            <h4>Receitas</h4>
            <p id="money-plus" className="money plus">+ R${income.toFixed(2)}</p>
          </div>
          <div>
            <h4>Despesas</h4>
            <p id="money-minus" className="money minus">- R${Math.abs(expense).toFixed(2)}</p>
          </div>
        </div>

        <h3>Transações</h3>
        <ul id="transactions" className="transactions">
          {transactions.map((transaction, index) => (
            <li key={index}>{transaction.name}: R$ {transaction.amount.toFixed(2)}</li>
          ))}
        </ul>

        <h3>Adicionar transação</h3>
        <form id="form" onSubmit={adicionarTransacao}>
          <div className="form-control">
            <label htmlFor="text">Nome</label>
            <input autoFocus type="text" id="text" placeholder="Nome da transação" required />
          </div>

          <div className="form-control">
            <label htmlFor="amount">Valor <br />
              <small>(negativo - despesas, positivo - receitas)</small>
            </label>
            <input type="number" id="amount" placeholder="Valor da transação" required />
          </div>

          <button className="btn">Adicionar</button>
        </form>

        <button id="fechar-mes-btn" onClick={() => {/* Lógica para fechar o mês */}}>Fechar Mês</button>

        <section id="resumo-grafico">
          <h2>Resumo Gráfico</h2>
          <canvas id="graficoPizza" width="400" height="400"></canvas>
        </section>
      </div>
    </div>
  );
};

export default Home;
