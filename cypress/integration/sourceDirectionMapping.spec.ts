describe('Source Direction Mapping', () => {
    it('should render user messages as "outgoing" by default', () => {
        cy.visitWebchat().initMockWebchat().openWebchat();

        cy.receiveMessage('user message', {}, 'user');

        cy.get('.webchat-message-row.user').should('have.css', 'flex-direction', 'row-reverse');
    });

    it('should render bot messages as "incoming" by default', () => {
        cy.visitWebchat().initMockWebchat().openWebchat();

        cy.receiveMessage('bot message', {}, 'bot');

        cy.get('.webchat-message-row.bot').should('have.css', 'flex-direction', 'row');
    });

    it('should render agent messages as "incoming" by default', () => {
        cy.visitWebchat().initMockWebchat().openWebchat();

        cy.receiveMessage('agent message', {}, 'agent');

        cy.get('.webchat-message-row.agent').should('have.css', 'flex-direction', 'row');
    });

    it('should render user messages as "incoming" if configures in sourceDirectionMapping', () => {
        cy.visitWebchat().initMockWebchat({
            settings: {
                sourceDirectionMapping: {
                    user: 'incoming'
                }
            }
        }).openWebchat();

        cy.receiveMessage('user message', {}, 'user');

        cy.get('.webchat-message-row.user').should('have.css', 'flex-direction', 'row');
    });

    it('should render bot messages as "outgoing" if configures in sourceDirectionMapping', () => {
        cy.visitWebchat().initMockWebchat({
            settings: {
                sourceDirectionMapping: {
                    bot: 'outgoing'
                }
            }
        }).openWebchat();

        cy.receiveMessage('bot message', {}, 'bot');

        cy.get('.webchat-message-row.bot').should('have.css', 'flex-direction', 'row-reverse');
    });

    it('should render user messages as "incoming" if configures in sourceDirectionMapping', () => {
        cy.visitWebchat().initMockWebchat({
            settings: {
                sourceDirectionMapping: {
                    user: 'incoming'
                }
            }
        }).openWebchat();

        cy.receiveMessage('user message', {}, 'user');

        cy.get('.webchat-message-row.user').should('have.css', 'flex-direction', 'row');
    });
});