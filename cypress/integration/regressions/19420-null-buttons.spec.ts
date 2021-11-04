describe('Message Templates with null Buttons', () => {
  beforeEach(() => {
    cy.visitBuild();
    cy.initMockWebchat();
    cy.openWebchat();
  });

  it('renders a gallery with null buttons', () => {
    cy.fixture('messages/gallery-with-null-buttons.json')
      .then(({ text, data, source }) => {
        cy.receiveMessage(text, data, source);
      });

    cy.contains('dffdg').should('be.visible');
  });

  it('renders a list with null buttons', () => {
    cy.fixture('messages/list-with-null-buttons.json')
      .then(({ text, data, source }) => {
        cy.receiveMessage(text, data, source);
      });

    cy.contains('foobar009l1').should('be.visible');
  });

  it('renders a text with buttons with null buttons', () => {
    cy.fixture('messages/buttons-with-null-buttons.json')
      .then(({ text, data, source }) => {
        cy.receiveMessage(text, data, source);
      });

    cy.contains('foobar005').should('be.visible');
  });

  it('renders text+quick replies with null quick replies', () => {
    cy.fixture('messages/quick-replies-with-null-quick-replies.json')
      .then(({ text, data, source }) => {
        cy.receiveMessage(text, data, source);
      });

    cy.contains('foobar003').should('be.visible');
  });
});