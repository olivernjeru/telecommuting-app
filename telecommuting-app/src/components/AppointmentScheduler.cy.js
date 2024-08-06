// AppointmentScheduler.cy.js

import React from 'react';
import AppointmentScheduler from './AppointmentScheduler';

describe('<AppointmentScheduler />', () => {
  beforeEach(() => {
    cy.mount(<AppointmentScheduler />);
  });

  it('renders the component', () => {
    cy.contains('h4', 'Schedule Appointment').should('be.visible');
  });

  it('allows input in all fields', () => {
    cy.get('input').eq(0).type('doctor@example.com');
    cy.get('input[type="date"]').type('2024-08-01');
    cy.get('input[type="time"]').type('14:30');
  });

  it('attempts to schedule an appointment', () => {
    cy.get('input').eq(0).type('doctor@example.com');
    cy.get('input[type="date"]').type('2024-08-01');
    cy.get('input[type="time"]').type('14:30');
    
    cy.contains('button', 'Schedule Appointment').click();

    // Check for the Snackbar
    cy.get('.MuiSnackbar-root', { timeout: 10000 }).should('be.visible')
      .within(() => {
        cy.get('.MuiAlert-message').then($message => {
          expect($message.text()).to.be.oneOf([
            'Appointment scheduled successfully!',
            'Failed to schedule appointment. Please try again.'
          ]);
        });
      });
  });

  it('clears fields after successful scheduling', () => {
    cy.get('input').eq(0).type('doctor@example.com');
    cy.get('input[type="date"]').type('2024-08-01');
    cy.get('input[type="time"]').type('14:30');
    
    cy.contains('button', 'Schedule Appointment').click();

    // Wait for success message
    cy.contains('.MuiAlert-message', 'Appointment scheduled successfully!', { timeout: 10000 }).should('be.visible');

    // Check if fields are cleared
    cy.get('input').eq(0).should('have.value', '');
    cy.get('input[type="date"]').should('have.value', '');
    cy.get('input[type="time"]').should('have.value', '');
  });

  // it('displays error message on failed scheduling', () => {
  //   // Simulate a network error
  //   cy.intercept('POST', '**/appointments', { statusCode: 500 }).as('scheduleAppointment');

  //   cy.get('input').eq(0).type('doctor@example.com');
  //   cy.get('input[type="date"]').type('2024-08-01');
  //   cy.get('input[type="time"]').type('14:30');
    
  //   cy.contains('button', 'Schedule Appointment').click();

  //   // Check for error message
  //   cy.contains('.MuiAlert-message', 'Failed to schedule appointment. Please try again.', { timeout: 10000 }).should('be.visible');
  // });
});