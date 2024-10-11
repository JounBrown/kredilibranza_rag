import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import './NavBar.css';


function NavBar() {
  const location = useLocation();
  const navigate = useNavigate(); // Hook para redireccionar programáticamente
  const isChatbotPage = location.pathname === "/chatbot";
  const [showLogin, setShowLogin] = useState(false);

  return (
    <nav id="navegacion">
      {!isChatbotPage && (
        <>
          <img src="/img/logo sin fondo.png" alt="Kredilibranza Logo" className="logo" />
          <img id="Clientes" src="/img/clientes.png" alt="Clientes" />
          <span id="txtClientes" style={{ color: "#ed5621" }}>Clientes: 500</span>
          <ul>
            <li><Link to="/">Simulador</Link></li>
            <li><Link to="/#condiciones">Condiciones</Link></li>
            <li><Link to="/#quienes-somos">¿Quiénes Somos?</Link></li>
            <li><Link to="/#contacto">Contáctanos</Link></li>
            <li><Link to="/chatbot">ChatBot</Link></li>
            <li><Link to="/FileUpload">RAG</Link></li>
            <li>
              <button className="login" onClick={() => navigate('/login')}>
                Iniciar sesión
              </button>
            </li>
          </ul>
        </>
      )}
      {isChatbotPage && (
        <ul>
          <li>
            <Link to="/">Volver</Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
export default NavBar;
