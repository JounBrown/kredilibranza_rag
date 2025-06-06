// src/layouts/MainLayout.jsx
import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
// No necesitas Header aquí si NavBar tiene border-bottom

function MainLayout({ children }) {
  return (
    <div className="AppLayout"> {/* Puedes usar una clase específica para el layout */}
      <NavBar />
      {/* Aplicar padding-top aquí para empujar el contenido principal hacia abajo */}
      <main style={{ paddingTop: '10vh' }}> {/* Usa el mismo valor que la altura del nav */}
        {children} {/* children será HomePage */}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;