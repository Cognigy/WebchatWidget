describe('Source Color Mapping', () => {
    beforeEach(() => {
        cy.visitWebchat().initMockWebchat().openWebchat();
        cy.window().then(window => {
            cy.getWebchat().then(webchat => {
                // @ts-ignore
                window.webchat = webchat;
            });
        })
    });

    it('should render user messages as "neutral" by default', () => {

        cy.receiveMessage('user message', {}, 'user');

        cy.get('.regular-message.user').should('have.css', 'background-color', 'rgb(255, 255, 255)');
    });

    it('should render bot messages as "primary" by default', () => {
        cy.visitWebchat().initMockWebchat().openWebchat();

        cy.receiveMessage('bot message', {}, 'bot');

        cy.get('.regular-message.bot').should('have.css', 'background', 'rgba(0, 0, 0, 0) linear-gradient(185deg, rgb(73, 91, 191), rgb(63, 81, 181)) repeat scroll 0% 0% / auto padding-box border-box');
    });

    it('should render agent messages as "primary" by default', () => {
        cy.visitWebchat().initMockWebchat().openWebchat();

        cy.receiveMessage('agent message', {}, 'agent');

        cy.get('.regular-message.agent').should('have.css', 'background', 'rgba(0, 0, 0, 0) linear-gradient(185deg, rgb(73, 91, 191), rgb(63, 81, 181)) repeat scroll 0% 0% / auto padding-box border-box');
    });

    it('should render user messages as "primary" if configures in sourceColorMapping', () => {
        cy.visitWebchat().initMockWebchat({
            settings: {
                sourceColorMapping: {
                    user: 'primary'
                }
            }
        }).openWebchat();

        cy.receiveMessage('user message', {}, 'user');

        cy.get('.regular-message.user').should('have.css', 'background', 'rgba(0, 0, 0, 0) linear-gradient(185deg, rgb(73, 91, 191), rgb(63, 81, 181)) repeat scroll 0% 0% / auto padding-box border-box');
    });

    it('should render bot messages as "neutral" if configures in sourceColorMapping', () => {
        cy.visitWebchat().initMockWebchat({
            settings: {
                sourceColorMapping: {
                    bot: 'neutral'
                }
            }
        }).openWebchat();

        cy.receiveMessage('bot message', {}, 'bot');

        cy.get('.regular-message.bot').should('have.css', 'background-color', 'rgb(255, 255, 255)');
    });

    it('should render agent messages as "neutral" if configures in sourceColorMapping', () => {
        cy.visitWebchat().initMockWebchat({
            settings: {
                sourceColorMapping: {
                    agent: 'neutral'
                }
            }
        }).openWebchat();

        cy.receiveMessage('agent message', {}, 'agent');

        cy.get('.regular-message.agent').should('have.css', 'background-color', 'rgb(255, 255, 255)');
    });
});