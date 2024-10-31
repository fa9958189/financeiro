// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Gastos from './Gastos';
import Fechamento from './Fechamento';
import Dizimistas from './Dizimistas';
import './style.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gastos" element={<Gastos />} />
        <Route path="/fechamento" element={<Fechamento />} />
        <Route path="/dizimistas" element={<Dizimistas />} />
      </Routes>
    </Router>
  );
};

export default App;
