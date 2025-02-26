describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the main title', () => {
    cy.contains('h1', 'Measurement').should('exist');
  });

  it('should navigate to full-body measurement page', () => {
    cy.contains('Full Body').click();
    cy.url().should('include', '/measurement/full-body-suit');
    cy.contains('Full Body Measurements').should('exist');
  });

  it('should navigate to helmet measurement page', () => {
    cy.contains('Helmet').click();
    cy.url().should('include', '/measurement/helmet');
    cy.contains('Helmet').should('exist');
  });
});