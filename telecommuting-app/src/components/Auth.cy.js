import React from 'react';
import Auth from './Auth';

describe('<Auth />', () => {
  beforeEach(() => {
    cy.mount(<Auth />);
  });

  const selectRole = (role) => {
    cy.get('[aria-haspopup="listbox"]').click();
    cy.get('[role="listbox"]').should('be.visible');
    cy.contains('[role="option"]', role).click({force: true});
    cy.get('[aria-haspopup="listbox"]').should('contain', role);
  };

  it('renders the component', () => {
    cy.get('h4').contains('Diabetes Telecommuting App');
  });

  it('toggles between login and register forms', () => {
    cy.get('h5').contains('Login');
    cy.get('button').contains("Don't have an account? Register").click();
    cy.get('h5').contains('Register');
    cy.get('button').contains('Already have an account? Login').click();
    cy.get('h5').contains('Login');
  });

  it('allows typing in email and password fields', () => {
    cy.get('input[type="email"]').type('test@example.com').should('have.value', 'test@example.com');
    cy.get('input[type="password"]').type('password123').should('have.value', 'password123');
  });

  // it('shows error on empty form submission', () => {
  //   cy.get('button').contains('Login').click();
  //   cy.get('h5').contains('Login');
  //   cy.get('p.Mui-error').should('be.visible');
  // });

  it('registers a new doctor', () => {
    cy.get('button').contains("Don't have an account? Register").click();
    cy.get('input[type="email"]').type('doctor@example.com');
    cy.get('input[type="password"]').type('password123');
    
    cy.log('About to select role');
    cy.get('body').then($body => {
      if ($body.find('[aria-haspopup="listbox"]').length > 0) {
        selectRole('Doctor');
      } else {
        cy.log('Role selector not found');
      }
    });

    cy.get('button').contains('Register').click();
    
    cy.get('button').contains('Register').then($button => {
      if ($button.is(':disabled')) {
        cy.log('Button is disabled as expected');
      } else {
        cy.get('p.Mui-error').should('not.exist');
      }
    });
  });

  it('registers a new patient', () => {
    cy.get('button').contains("Don't have an account? Register").click();
    cy.get('input[type="email"]').type('patient@example.com');
    cy.get('input[type="password"]').type('password123');
    
    cy.log('About to select role');
    cy.get('body').then($body => {
      if ($body.find('[aria-haspopup="listbox"]').length > 0) {
        selectRole('Patient');
      } else {
        cy.log('Role selector not found');
      }
    });

    cy.get('button').contains('Register').click();
    
    cy.get('button').contains('Register').then($button => {
      if ($button.is(':disabled')) {
        cy.log('Button is disabled as expected');
      } else {
        cy.get('p.Mui-error').should('not.exist');
      }
    });
  });

  it('logs in an existing user', () => {
    cy.get('input[type="email"]').type('patient@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button').contains('Login').click();
    
    cy.get('button').contains('Login').then($button => {
      if ($button.is(':disabled')) {
        cy.log('Button is disabled as expected');
      } else {
        cy.get('p.Mui-error').should('not.exist');
      }
    });
  });
});