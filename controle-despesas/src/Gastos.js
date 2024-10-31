// src/Gastos.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const Gastos = () => {
  const [gastos, setGastos] = useState([]);
  const [totalGastos, setTotalGastos] = useState(0);
  const [igrejaDistribuicao, setIgrejaDistribuicao] = useState(0);
  const [saldoIgreja, setSaldoIgreja] = useState(0);

  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    // Filtrando apenas os gastos
    const gastosFiltrados = storedTransactions.filter(trans => trans.amount < 0);
    setGastos(gastosFiltrados);
    calcularValores(storedTransactions, gastosFiltrados);
  }, []);

  const calcularValores = (storedTransactions, gastosFiltrados) => {
    // Calculando o total de gastos
    const total = gastosFiltrados.reduce((acc, trans) => acc + Math.abs(trans.amount), 0);
    setTotalGastos(total);

    // Cálculo da distribuição da Igreja (50%)
    const totalAmount = storedTransactions.reduce((acc, trans) => acc + trans.amount, 0);
    const igrejaValue = (totalAmount * 0.50).toFixed(2);
    setIgrejaDistribuicao(igrejaValue);

    // Cálculo do saldo da igreja
    const saldo = (igrejaValue - total).toFixed(2);
    setSaldoIgreja(saldo);
  };

  return (
    <div>
      <h2>Lista de Gastos</h2>

      <div className="container">
        <h3>Distribuição da Igreja (50%)</h3>
        <p id="igreja-distribuicao">R$ {igrejaDistribuicao}</p>

        <h3>Detalhes dos Gastos</h3>
        <table className="gastos-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody id="gastos-list">
            {gastos.map((trans, index) => (
              <tr key={index}>
                <td>{trans.name}</td>
                <td>R$ {Math.abs(trans.amount).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Total de Gastos</h3>
        <p id="total-gastos">R$ {totalGastos.toFixed(2)}</p>

        <h3>Saldo da Igreja</h3>
        <p id="saldo-igreja">R$ {saldoIgreja}</p>

        <Link to="/" className="btn">Voltar para o Controle de Despesas</Link>
      </div>
    </div>
  );
};

export default Gastos;
