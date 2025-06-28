import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

function MainLayout({ children }) {
  return (
    <div className="AppLayout">
      <NavBar />
      <main style={{ paddingTop: '10vh' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;