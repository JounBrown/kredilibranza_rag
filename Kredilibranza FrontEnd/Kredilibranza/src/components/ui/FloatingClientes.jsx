import React from 'react';
import './FloatingClientes.css';

function FloatingClientes() {
  return (
    <div className="floating-clientes">
      <img src="/img/clientes.png" alt="Clientes" className="clientes-img" />
      <span className="clientes-text">Clientes: 500</span>
    </div>
  );
}

export default FloatingClientes;