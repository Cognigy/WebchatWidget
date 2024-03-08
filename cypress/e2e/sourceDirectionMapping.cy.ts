describe('Source Direction Mapping', () => {
    it('should render user messages as "outgoing" by default', () => {
        cy.visitWebchat().initMockWebchat().openWebchat().startConversation();

        cy.receiveMessage('user message', {}, 'user');

        cy.get('.webchat-message-row.user .chat-bubble').should('not.have.css', 'margin-inline-start', '0px');

    });

    it('should render bot messages as "incoming" by default', () => {
        cy.visitWebchat().initMockWebchat().openWebchat().startConversation();

        cy.receiveMessage('bot message', {}, 'bot');

        cy.get('.webchat-message-row.bot').should('have.css', 'flex-direction', 'row');
        cy.get('.chat-bubble').should('have.css', 'margin-inline-start', '0px');
    });

    it('should render agent messages as "incoming" by default', () => {
        cy.visitWebchat().initMockWebchat().openWebchat().startConversation();

        cy.receiveMessage('agent message', {}, 'agent');

        cy.get('.webchat-message-row.agent').should('have.css', 'flex-direction', 'row');
        cy.get('.chat-bubble').should('have.css', 'margin-inline-start', '0px');
    });

    //TODO: SourceDirectionMapping is not working anymore. Check if this is planned in a follow-up

    xit('should render user messages as "incoming" if configures in sourceDirectionMapping', () => {
        cy.visitWebchat().initMockWebchat({
            settings: {
                widgetSettings: {
                    sourceDirectionMapping: {
                        user: 'incoming'
                    }
                }
            }
        }).openWebchat().startConversation();

        cy.receiveMessage('user message', {}, 'user');

        cy.get('.webchat-message-row.user').should('have.css', 'flex-direction', 'row');
        cy.get('.chat-bubble').should('have.css', 'margin-inline-start', '0px');
    });

    xit('should render bot messages as "outgoing" if configures in sourceDirectionMapping', () => {
        cy.visitWebchat().initMockWebchat({
            settings: {
                widgetSettings: {
                    sourceDirectionMapping: {
                        bot: 'outgoing'
                    }
                }
            }
        }).openWebchat().startConversation();

        cy.receiveMessage('bot message', {}, 'bot');

        cy.get('.webchat-message-row.bot').should('have.css', 'flex-direction', 'row-reverse');
        cy.get('.chat-bubble').should('not.have.css', 'margin-inline-start', '0px');
    });

    xit('should render agent messages as "outgoing" if configures in sourceDirectionMapping', () => {
        cy.visitWebchat().initMockWebchat({
            settings: {
                widgetSettings: {
                    sourceDirectionMapping: {
                        agent: 'outgoing'
                    }  
                }
            }
        }).openWebchat();

        cy.receiveMessage('agent message', {}, 'agent');

        cy.get('.webchat-message-row.agent').should('have.css', 'flex-direction', 'row');
        cy.get('.chat-bubble').should('not.have.css', 'margin-inline-start', '0px');
    });

    xit('should render bot quick reply messages as "outgoing" if configured in sourceDirectionMapping', () => {
        cy.visitWebchat().initMockWebchat({
            settings: {
                widgetSettings: {
                    sourceDirectionMapping: {
                        user: 'outgoing'
                    }  
                }
            }
        });
        cy.openWebchat();

        cy.fixture('messages/quick-replies.json').then(quickReplyMessages => {
            const { text, data, source } = quickReplyMessages[0];

            cy.receiveMessage(text, data, source);
        });

        cy.get('.webchat-quick-reply-template-header-message').should('not.have.css', 'margin-inline-start', '0px');
    });

    xit('should render bot quick reply messages as "incoming" if configured in sourceDirectionMapping', () => {
        cy.visitWebchat().initMockWebchat({
            settings: {
                widgetSettings: {
                    sourceDirectionMapping: {
                        user: 'incoming'
                    }  
                }
            }
        });
        cy.openWebchat();

        cy.fixture('messages/quick-replies.json').then(quickReplyMessages => {
            const { text, data, source } = quickReplyMessages[0];

            cy.receiveMessage(text, data, source);
        });

        cy.get('.webchat-quick-reply-template-header-message').should('have.css', 'margin-inline-start', '0px');
    });
});