import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./layouts";
import { HomePage } from "./pages";
import { LoginPage } from "./features/auth";
import { ChatBotPage, FloatingChatBot } from "./features/chatbot";
import { FileUploadPage } from "./features/file-management";

// Importar estilos globales
import './features/form-submission/styles/Form.css';
import './features/company-info/styles/Condiciones.css';
import './features/company-info/styles/QuienesSomos.css';
import './features/simulator/styles/Simulador.css';
import './features/chatbot/styles/FloatingChatBot.css';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            }
          />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/chatbot" element={<ChatBotPage />} />

          <Route
            path="/fileupload"
            element={
              <PrivateRoute>
                <FileUploadPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <FloatingChatBot />
      </div>
    </Router>
  );
}

export default App;