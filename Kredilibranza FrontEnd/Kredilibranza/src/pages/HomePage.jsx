import React from 'react';
import { RegistrationForm } from '../features/form-submission';
import { CompanyConditions, AboutUs } from '../features/company-info';
import { LoanSimulator } from '../features/simulator';

function HomePage() {
  return (
    <>
      <RegistrationForm />
      <CompanyConditions />
      <LoanSimulator />
      <AboutUs />
    </>
  );
}

export default HomePage;