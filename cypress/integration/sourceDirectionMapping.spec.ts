describe('Source Direction Mapping', () => {
    it('should render user messages as "outgoing" by default', () => {
        cy.visitWebchat().initMockWebchat().openWebchat();

        cy.receiveMessage('user message', {}, 'user');

        cy.get('.webchat-message-row.user').should('have.css', 'flex-direction', 'row-reverse');
        cy.get('.regular-message').should('have.css', 'border-bottom-right-radius', '0px');
    });

    it('should render bot messages as "incoming" by default', () => {
        cy.visitWebchat().initMockWebchat().openWebchat();

        cy.receiveMessage('bot message', {}, 'bot');

        cy.get('.webchat-message-row.bot').should('have.css', 'flex-direction', 'row');
        cy.get('.regular-message').should('have.css', 'border-bottom-left-radius', '0px');
    });

    it('should render agent messages as "incoming" by default', () => {
        cy.visitWebchat().initMockWebchat().openWebchat();

        cy.receiveMessage('agent message', {}, 'agent');

        cy.get('.webchat-message-row.agent').should('have.css', 'flex-direction', 'row');
        cy.get('.regular-message').should('have.css', 'border-bottom-left-radius', '0px');
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
        cy.get('.regular-message').should('have.css', 'border-bottom-left-radius', '0px');
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
        cy.get('.regular-message').should('have.css', 'border-bottom-right-radius', '0px');
    });

    it('should render user messages as "incoming" if configured in sourceDirectionMapping', () => {
        cy.visitWebchat().initMockWebchat({
            settings: {
                sourceDirectionMapping: {
                    user: 'incoming'
                }
            }
        }).openWebchat();

        cy.receiveMessage('user message', {}, 'user');

        cy.get('.webchat-message-row.user').should('have.css', 'flex-direction', 'row');
        cy.get('.regular-message').should('have.css', 'border-bottom-left-radius', '0px');
    });

    it('should render bot quick reply messages as "outgoing" if configured in sourceDirectionMapping', () => {
        cy.visitWebchat().initMockWebchat({
            settings: {
                sourceDirectionMapping: {
                    bot: 'outgoing'
                }
            }
        });
        cy.openWebchat();

        cy.fixture('messages/quick-replies.json').then(quickReplyMessages => {
            const { text, data, source } = quickReplyMessages[0];

            cy.receiveMessage(text, data, source);
        });

        cy.get('.webchat-quick-reply-template-header-message').should('have.css', 'border-bottom-right-radius', '0px');
    });

    it('should render bot quick reply messages as "incoming" if configured in sourceDirectionMapping', () => {
        cy.visitWebchat().initMockWebchat({
            settings: {
                sourceDirectionMapping: {
                    bot: 'incoming'
                }
            }
        });
        cy.openWebchat();

        cy.fixture('messages/quick-replies.json').then(quickReplyMessages => {
            const { text, data, source } = quickReplyMessages[0];

            cy.receiveMessage(text, data, source);
        });

        cy.get('.webchat-quick-reply-template-header-message').should('have.css', 'border-bottom-left-radius', '0px');
    });
});