describe('Source Color Mapping', () => {
    beforeEach(() => {
        cy.visitWebchat().initMockWebchat().openWebchat().startConversation();
        cy.window().then(window => {
            cy.getWebchat().then(webchat => {
                // @ts-ignore
                window.webchat = webchat;
            });
        })
    });

    it('should render user messages as a shade of primary by default', () => {

        cy.receiveMessage('user message', {}, 'user');

        cy.get('.webchat-message-row.user .chat-bubble').should('have.css', 'background-color', 'rgb(232, 235, 255)');
    });

    it('should render bot messages as neutral by default', () => {
        cy.visitWebchat().initMockWebchat().openWebchat().startConversation();

        cy.receiveMessage('bot message', {}, 'bot');

        cy.get('.webchat-message-row.bot .chat-bubble').should('have.css', 'background-color', 'rgb(255, 255, 255)');
    });

    it('should render agent messages as "neutral" by default', () => {
        cy.visitWebchat().initMockWebchat().openWebchat().startConversation();

        cy.receiveMessage('agent message', {}, 'agent');

        cy.get('.webchat-message-row.agent .chat-bubble').should('have.css', 'background-color', 'rgb(255, 255, 255)');
    });

    it('should render user messages as "neutral" if configures in sourceColorMapping', () => {
        cy.visitWebchat().initMockWebchat({
            settings: {
                widgetSettings: {
                    sourceColorMapping: {
                        user: 'bot'
                    }
                }
            }
        }).openWebchat().startConversation();

        cy.receiveMessage('user message', {}, 'user');

        cy.get('.webchat-message-row.user .chat-bubble').should('have.css', 'background-color', 'rgb(255, 255, 255)');
    });

    it('should render bot messages as "primary" if configures in sourceColorMapping', () => {
        cy.visitWebchat().initMockWebchat({
            settings: {
                widgetSettings: {
                    sourceColorMapping: {
                        bot: 'user'
                    }
                }
            }
        }).openWebchat().startConversation();

        cy.receiveMessage('bot message', {}, 'bot');

        cy.get('.webchat-message-row.bot .chat-bubble').should('have.css', 'background-color', 'rgb(232, 235, 255)');
    });

    it('should render agent messages as "primary" if configures in sourceColorMapping', () => {
        cy.visitWebchat().initMockWebchat({
            settings: {
                widgetSettings: {
                    sourceColorMapping: {
                        agent: 'user'
                    }
                }
            }
        }).openWebchat().startConversation();

        cy.receiveMessage('agent message', {}, 'agent');

        cy.get('.webchat-message-row.agent .chat-bubble').should('have.css', 'background-color', 'rgb(232, 235, 255)');
    });
});