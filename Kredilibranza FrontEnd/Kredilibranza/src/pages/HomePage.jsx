// src/pages/HomePage.jsx
import React from 'react';
import { RegistrationForm } from '../features/form-submission';
import { CompanyConditions, AboutUs } from '../features/company-info';
import { LoanSimulator } from '../features/simulator';
// import { Header } from '../layouts'; // Ya no es necesario

function HomePage() {
  return (
    <>
      {/* <Header />  Eliminado */}
      <RegistrationForm />
      <CompanyConditions />
      <LoanSimulator />
      <AboutUs />
    </>
  );
}

export default HomePage;