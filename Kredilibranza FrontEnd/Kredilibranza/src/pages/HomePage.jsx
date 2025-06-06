import React from 'react';
import { RegistrationForm } from '../features/form-submission';
import { CompanyConditions, AboutUs } from '../features/company-info';
import { LoanSimulator } from '../features/simulator';
import { Header } from '../layouts';

function HomePage() {
  return (
    <>
      <Header />
      <RegistrationForm />
      <CompanyConditions />
      <LoanSimulator />
      <AboutUs />
    </>
  );
}

export default HomePage;