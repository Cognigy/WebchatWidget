// TODO move it to s separate from outdated message-render as it is still a valid test case
xdescribe('Source Direction Mapping', () => {
    beforeEach(() => {
        cy.visitMessageRenderer();
    });

    it('should render user messages as "outgoing" by default', () => {
        cy.renderMessage('user message', {}, 'user');

        cy.get('.webchat-message-row.user > div').should('have.css', 'margin-inline-start');
    });

    it('should render bot messages as "incoming" by default', () => {
        cy.renderMessage('bot message', {}, 'bot');

        cy.get('.webchat-message-row.bot').should('have.css', 'flex-direction', 'row');
    });

    it('should render agent messages as "incoming" by default', () => {
        cy.renderMessage('agent message', {}, 'agent');

        cy.get('.webchat-message-row.agent').should('have.css', 'flex-direction', 'row');
    });

    it('should render user messages as "incoming" if configures in sourceDirectionMapping', () => {
        cy.renderMessage('user message', {}, 'user', { 
            settings: {
                sourceDirectionMapping: {
                    user: 'incoming'
                }
            }
        });

        cy.get('.webchat-message-row.user').should('have.css', 'flex-direction', 'row');
    });

    it('should render bot messages as "outgoing" if configures in sourceDirectionMapping', () => {
        cy.renderMessage('bot message', {}, 'bot', { 
            settings: {
                sourceDirectionMapping: {
                    bot: 'outgoing'
                }
            }
        });

        cy.get('.webchat-message-row.bot > div').should('have.css', 'margin-inline-end');
    });

    it('should render user messages as "incoming" if configures in sourceDirectionMapping', () => {
        cy.renderMessage('user message', {}, 'user', { 
            settings: {
                sourceDirectionMapping: {
                    user: 'incoming'
                }
            }
        });

        cy.get('.webchat-message-row.user').should('have.css', 'flex-direction', 'row');
    });
});