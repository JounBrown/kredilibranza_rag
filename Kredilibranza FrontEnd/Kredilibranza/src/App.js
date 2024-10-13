import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./componentes/NavBar";
import Header from "./componentes/Header";
import Form from "./componentes/Form";
import Condiciones from "./componentes/Condiciones";
import Simulador from "./componentes/Simulador";
import QuienesSomos from "./componentes/QuienesSomos";
import Footer from "./componentes/Footer";
import ChatBotPage from "./componentes/chatbot";
import FileUpload from "./componentes/FileUpload";

import Login from "./componentes/Login"; // Importa el componente Login

import './componentes/Banner.css';
import './componentes/Footer.css';
import './componentes/Form.css';
import './componentes/NavBar.css';
import './componentes/QuienesSomos.css';
import './componentes/Simulador.css';
import './componentes/Condiciones.css';
import './componentes/chatbot.css';

// Definir el componente PrivateRoute
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          {/* Ruta pública: Página principal */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <Form />
                <Condiciones />
                <Simulador />
                <QuienesSomos />
                <Footer />
              </>
            }
          />

          {/* Ruta pública: Login */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route path="/chatbot"element={<ChatBotPage />}/>

          <Route
            path="/fileupload"
            element={
              <PrivateRoute>
                <FileUpload />
              </PrivateRoute>
            }
          />

          {/* Redirige cualquier otra ruta a /login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
