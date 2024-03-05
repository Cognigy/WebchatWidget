describe("Malformed Default Reply Messages", () => {
    it("Does not crash when rendering a malformed default reply message with webchat tab content", () => {
      cy.visitWebchat();
      cy.initMockWebchat();
      cy.openWebchat();
      cy.startConversation();
      
      cy.fixture('messages/malformed-webchat-defaultreply.json')
          .then(({ text, data, source }) => {
            cy.receiveMessage(text, data, source);
          });
    
        cy.contains('some quick reply message').should('be.visible');
    });
});