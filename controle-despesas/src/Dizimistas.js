// src/Dizimista.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const Dizimista = () => {
  const [dizimistas, setDizimistas] = useState([]);

  useEffect(() => {
    carregarDizimistas();
  }, []);

  const carregarDizimistas = () => {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    // Filtrando apenas as transações positivas
    const dizimistasFiltrados = storedTransactions.filter(trans => trans.amount > 0);
    setDizimistas(dizimistasFiltrados);
  };

  return (
    <div>
      <h2>Lista de Dizimistas</h2>

      <div className="container">
        <h3>Transações com saldo positivo</h3>
        <table className="gastos-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody id="positive-transactions">
            {dizimistas.map((trans, index) => (
              <tr key={index}>
                <td>{trans.name}</td>
                <td>R$ {trans.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Link to="/" className="btn">Voltar ao Controle de Despesas</Link>
      </div>
    </div>
  );
};

export default Dizimista;
