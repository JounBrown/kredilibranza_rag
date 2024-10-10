import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Importamos el componente principal de la aplicación

// Renderiza la aplicación dentro del div con id "root" en index.html
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
