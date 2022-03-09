describe('Home Page', () => {
  beforeEach(() => {
    cy.fixture('courses.json').as('coursesJSON');
    cy.server();
    cy.route('/api/courses', '@coursesJSON').as('courses');
    cy.visit('/');
  });

  it('should display a list of courses', () => {

    cy.contains('All Courses');
    cy.wait('@courses');
    cy.get('mat-card').should('have.length', 9)
  });

  it('should be display the advance courses', () => {
    cy.get('.mat-tab-label').should('have.length', 2);
    cy.get('.mat-tab-label').last().click();
    cy.get('mat-card').should('have.length', 3)
    cy.get('.mat-tab-body-active .mat-card-title').its('length').should('be.gt', 1);
    cy.get('.mat-tab-body-active .mat-card-title').first().contains('Angular Security Course')
  })
});
