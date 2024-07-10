describe('Message Color Variants', () => {
    describe('neutral color', () => {
        beforeEach(() => {
            cy.visitWebchat();

            cy.initMockWebchat({
                settings: {
                    sourceColorMapping: {
                        agent: 'bot',
                        user: 'bot',
                        bot: 'bot'
                    }
                }
            });

            cy.openWebchat().startConversation();
        });

        it('renders a "text with buttons"', () => {
            cy.receiveMessageFixture('buttons');

            cy.get('.webchat-buttons-template-root .chat-bubble').should('have.css', 'background-color', 'rgb(255, 255, 255)');
            cy.get('.webchat-buttons-template-root .chat-bubble').should('have.css', 'color', 'rgb(28, 28, 28)');
        });

        it('renders a "gallery"', () => {
            cy.receiveMessageFixture('gallery');

            cy.get('.webchat-carousel-template-content').should('have.css', 'color', 'rgb(28, 28, 28)');
            cy.get('.webchat-carousel-template-button')
                .should('have.css', 'color', 'rgb(255, 255, 255)')
                .should('have.css', 'background-color', 'rgb(26, 26, 26)');
        });
        
        it('renders a "list"', () => {
            cy.receiveMessageFixture('list');

            cy.get('.webchat-list-template-header-button')
                .should('have.css', 'background-color', 'rgb(26, 26, 26)')
                .should('have.css', 'color', 'rgb(255, 255, 255)');
        });
        
        it('renders an "audio message"', () => {
            cy.receiveMessageFixture('audio');

            cy.get('.webchat-media-template-audio')
                .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
                .should('have.css', 'color', 'rgb(28, 28, 28)');
        });

        // not necessary, does not render any text/background
        xit('renders a "video message"');
        // not necessary, does not render any text/background
        xit('renders an "image message"');

        it('renders a "date picker"', () => {
            cy.receiveMessageFixture('date-picker');

            cy.get('.webchat-message-row button')
                .should('have.css', 'background-color', 'rgb(16, 13, 13)')
                .should('have.css', 'color', 'rgb(255, 255, 255)');
        });

        it('renders a "quick reply"', () => {
            cy.fixture('messages/quick-replies.json').then(quickReplyMessages => {
                const { text, data, source } = quickReplyMessages[0];

                cy.receiveMessage(text, data, source);

                cy.get('.webchat-quick-reply-template-header')
                    .should('have.css', 'color', 'rgb(28, 28, 28)');
            });
        });
    });

    describe('primary', () => {
        beforeEach(() => {
            cy.visitWebchat();

            cy.initMockWebchat({
                settings: {
                    widgetSettings: {
                        sourceColorMapping: {
                            agent: 'user',
                            user: 'user',
                            bot: 'user'
                        }
                    }
                }
            });

            cy.openWebchat().startConversation();
        });

        it('renders a "text with buttons"', () => {
            cy.receiveMessageFixture('buttons');

            cy.get('.webchat-buttons-template-root .chat-bubble').should('have.css', 'background-color', 'rgb(232, 235, 255)');
            cy.get('.webchat-buttons-template-root .chat-bubble').should('have.css', 'color', 'rgba(26, 26, 26, 0.95)');
        });

        it('renders a "quick reply"', () => {
            cy.fixture('messages/quick-replies.json').then(quickReplyMessages => {
                const { text, data, source } = quickReplyMessages[0];

                cy.receiveMessage(text, data, source);

                cy.get('.webchat-quick-reply-template-root .chat-bubble')
                    .should('have.css', 'background-color', 'rgb(232, 235, 255)');
            });
        });


        it('renders a "gallery"', () => {
            cy.receiveMessageFixture('gallery');

            cy.get('.webchat-carousel-template-content').should('have.css', 'color', 'rgb(28, 28, 28)');
            cy.get('.webchat-carousel-template-button')
                .should('have.css', 'color', 'rgb(255, 255, 255)')
                .should('have.css', 'background-color', 'rgb(26, 26, 26)');
        });

        it('renders a "list"', () => {
            cy.receiveMessageFixture('list');

            cy.get('.webchat-list-template-header-button')
                .should('have.css', 'background-color', 'rgb(26, 26, 26)')
                .should('have.css', 'color', 'rgb(255, 255, 255)');
        });

        // is always neutral
        it('renders an "audio message"');
        
        // doesn't have themed content
        it('renders a "video message"');

        // doen't have themed content
        it('renders an "image message"');
        
        it('renders a "date picker"', () => {
            cy.receiveMessageFixture('date-picker');

            cy.get('.webchat-message-row button')
                .should('have.css', 'background-color', 'rgb(26, 26, 26)')
                .should('have.css', 'color', 'rgb(255, 255, 255)');
        });
    });
})