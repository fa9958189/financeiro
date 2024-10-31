// src/Fechamento.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const Fechamento = () => {
  const [fechamentos, setFechamentos] = useState([]);
  const [detalhesFechamento, setDetalhesFechamento] = useState(null);

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  useEffect(() => {
    carregarCalendario();
  }, []);

  const carregarCalendario = () => {
    const storedFechamentos = JSON.parse(localStorage.getItem('fechamentos')) || [];
    setFechamentos(storedFechamentos);
  };

  const exibirDetalhesFechamento = (fechamento) => {
    setDetalhesFechamento(fechamento);
  };

  return (
    <div>
      <h2>Fechamentos Mensais</h2>

      {/* Calendário dos meses */}
      <div className="calendar" id="calendar">
        {meses.map((mes, index) => {
          const mesAno = `${mes} 2024`;
          const fechamento = fechamentos.find(f => f.mesAno === mesAno);
          const isClosed = !!fechamento;

          return (
            <div
              key={index}
              className={`month ${isClosed ? 'closed' : 'open'}`}
              onClick={() => {
                if (isClosed) {
                  exibirDetalhesFechamento(fechamento);
                } else {
                  alert(`${mesAno} ainda está aberto.`);
                }
              }}
            >
              {mes}
              <p>{isClosed ? 'Fechado' : 'Aberto'}</p>
            </div>
          );
        })}
      </div>

      {/* Detalhes do Fechamento */}
      {detalhesFechamento && (
        <div id="detalhes-fechamento">
          <h3>Detalhes do Fechamento</h3>
          <p id="igreja-distribuicao">Igreja (50%): R$ {detalhesFechamento.igrejaValue}</p>
          <p id="matriz-distribuicao">Matriz (10%): R$ {detalhesFechamento.matrizValue}</p>
          <p id="prebenda-distribuicao">Prebenda (40%): R$ {detalhesFechamento.prebendaValue}</p>
          <p id="total-gastos">Total de Gastos: R$ {detalhesFechamento.totalGastos}</p>
          <p id="saldo-igreja">Saldo da Igreja: R$ {detalhesFechamento.saldoIgreja}</p>

          <h3>Dizimistas</h3>
          <ul id="fechamento-dizimistas">
            {detalhesFechamento.dizimistas.map((trans, index) => (
              <li key={index}>{trans.name}: R$ {trans.amount.toFixed(2)}</li>
            ))}
          </ul>

          <h3>Gastos</h3>
          <ul id="fechamento-gastos">
            {detalhesFechamento.gastos.map((trans, index) => (
              <li key={index}>{trans.name}: R$ {Math.abs(trans.amount).toFixed(2)}</li>
            ))}
          </ul>
        </div>
      )}

      <Link to="/" className="btn">Voltar para o Controle de Despesas</Link>
    </div>
  );
};

export default Fechamento;
