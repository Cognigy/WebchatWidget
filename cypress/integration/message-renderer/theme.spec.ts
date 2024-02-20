xdescribe('Message Renderer Theme', () => {
    before(() => {
        cy.visitMessageRenderer();
    });

    it('uses an alternate theme for messages when providing colorScheme setting', () => {
        cy.renderMessage('hi', {}, 'bot', {
            settings: {
                colorScheme: "#FFAABB"
            }
        });

        cy.get('.regular-message')
            .should('have.css', 'background', 'rgba(0, 0, 0, 0) linear-gradient(185deg, rgb(255, 180, 197), rgb(255, 170, 187)) repeat scroll 0% 0% / auto padding-box border-box')
            .should('have.css', 'color', 'rgba(0, 0, 0, 0.95)');
    });
});