xdescribe('Source Color Mapping', () => {
    beforeEach(() => {
        cy.visitMessageRenderer();
    });

    it('should render user messages as "neutral" by default', () => {
        cy.renderMessage('user message', {}, 'user');

        cy.get('.webchat-message-row.user').should('have.css', 'background-color', 'rgb(255, 255, 255)');
    });

    it('should render bot messages as "primary" by default', () => {
        cy.renderMessage('bot message', {}, 'bot');

        cy.get('.webchat-message-row.bot').should('have.css', 'background', 'rgba(0, 0, 0, 0) linear-gradient(185deg, rgb(73, 91, 191), rgb(63, 81, 181)) repeat scroll 0% 0% / auto padding-box border-box');
    });

    it('should render agent messages as "primary" by default', () => {
        cy.renderMessage('agent message', {}, 'agent');

        cy.get('.webchat-message-row.agent').should('have.css', 'background', 'rgba(0, 0, 0, 0) linear-gradient(185deg, rgb(73, 91, 191), rgb(63, 81, 181)) repeat scroll 0% 0% / auto padding-box border-box');
    });

    it('should render user messages as "primary" if configures in sourceColorMapping', () => {
        cy.renderMessage('user message', {}, 'user', {
            settings: {
                sourceColorMapping: {
                    user: 'primary'
                }
            }
        });

        cy.get('.webchat-message-row.user').should('have.css', 'background', 'rgba(0, 0, 0, 0) linear-gradient(185deg, rgb(73, 91, 191), rgb(63, 81, 181)) repeat scroll 0% 0% / auto padding-box border-box');
    });

    it('should render bot messages as "neutral" if configures in sourceColorMapping', () => {
        cy.renderMessage('bot message', {}, 'bot', {
            settings: {
                sourceColorMapping: {
                    bot: 'neutral'
                }
            }
        });

        cy.get('.webchat-message-row.bot').should('have.css', 'background-color', 'rgb(255, 255, 255)');
    });

    it('should render agent messages as "neutral" if configures in sourceColorMapping', () => {
        cy.renderMessage('agent message', {}, 'agent', {
            settings: {
                sourceColorMapping: {
                    agent: 'neutral'
                }
            }
        });

        cy.get('.webchat-message-row.agent').should('have.css', 'background-color', 'rgb(255, 255, 255)');
    });
});