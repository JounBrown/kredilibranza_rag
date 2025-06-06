import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import './NavBar.css';

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isChatbotPage = location.pathname === "/chatbot";
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav id="navegacion">
      {!isChatbotPage && (
        <>
          <div className="navbar-left-content">
            <img src="/img/logo sin fondo.png" alt="Kredilibranza Logo" className="logo" />
            <img id="Clientes" src="/img/clientes.png" alt="Clientes Icon" />
            <span id="txtClientes" style={{ color: "#ed5621" }}>Clientes: 500</span>
          </div>
          <ul>
            <li><Link to="/">Simulador</Link></li>
            <li><Link to="/#condiciones">Condiciones</Link></li>
            <li><Link to="/#quienes-somos">¿Quiénes Somos?</Link></li>
            <li><Link to="/#contacto">Contáctanos</Link></li>
           
            {token ? (
              <>
                <li><Link to="/fileupload">Administrador</Link></li>
                <li>
                  <button className="login" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button className="login" onClick={() => navigate('/login')}>
                  Login
                </button>
              </li>
            )}
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