import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./componentes/NavBar";
import Header from "./componentes/Header";
import Form from "./componentes/Form";
import Condiciones from "./componentes/Condiciones";
import Simulador from "./componentes/Simulador";
import QuienesSomos from "./componentes/QuienesSomos";
import Footer from "./componentes/Footer";
import ChatBotPage from "./componentes/chatbot";

import './componentes/Banner.css';
import './componentes/Footer.css';
import './componentes/Form.css';
import './componentes/NavBar.css';
import './componentes/QuienesSomos.css';
import './componentes/Simulador.css';
import './componentes/Condiciones.css';
import './componentes/chatbot.css';

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          {}
          <Route
            path="/"
            element={
              <>
                <Header />
                <Form />
                <Condiciones />
                <Simulador />
                <QuienesSomos />
                <Footer /> {}
              </>
            }
          />
          {}
          <Route path="/chatbot" element={<ChatBotPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
