// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to fill in measurement form
Cypress.Commands.add('fillMeasurementForm', (orderNumber, ebayUsername, measurements) => {
  // Fill order details
  cy.get('#order-number').type(orderNumber);
  cy.get('#ebay-username').type(ebayUsername);
  
  // Fill measurements
  Object.entries(measurements).forEach(([name, value]) => {
    // Find the measurement card by name and fill the input
    cy.contains('.measurement-card', name)
      .find('input')
      .type(value.toString());
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      fillMeasurementForm(
        orderNumber: string, 
        ebayUsername: string, 
        measurements: Record<string, number>
      ): Chainable<void>;
    }
  }
}