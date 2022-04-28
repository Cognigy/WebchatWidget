describe('Adaptive Cards in Message renderer', () => {
    before(() => {
        cy.visitMessageRenderer();
    });

    it('should render an adaptive card', () => {
        cy.fixture('messages/adaptivecard.json').then((json) => {
            cy.renderMessage(null, json.data, 'bot', {
                settings: {
                    colorScheme: "#FFAABB"
                }
            });
        })

        cy.get('.adaptivecard-wrapper').should('exist');
        cy.get('.ac-adaptiveCard').should('exist');
        cy.get('.ac-textBlock').contains('Your registration is almost complete');
        cy.get('.ac-image').should('exist');
        cy.get('.ac-actionSet').should('exist').children('button').contains('Steak');
    });
});