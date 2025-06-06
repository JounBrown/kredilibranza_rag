import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

function MainLayout({ children }) {
  return (
    <div className="App">
      <NavBar />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;