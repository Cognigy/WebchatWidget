describe('Message Color Variants', () => {
    describe('neutral color', () => {
        beforeEach(() => {
            cy.visitWebchat();

            cy.initMockWebchat({
                settings: {
                    sourceColorMapping: {
                        agent: 'neutral',
                        user: 'neutral',
                        bot: 'neutral'
                    }
                }
            });

            cy.openWebchat();
        });

        it('renders a "text with buttons"', () => {
            cy.receiveMessageFixture('buttons');

            cy.get('.webchat-buttons-template-root').should('have.css', 'background', 'rgb(255, 255, 255) none repeat scroll 0% 0% / auto padding-box border-box');
            cy.get('.webchat-buttons-template-root').should('have.css', 'color', 'rgba(0, 0, 0, 0.95)');
        });

        it('renders a "gallery"', () => {
            cy.receiveMessageFixture('gallery');

            cy.get('.webchat-carousel-template-content').should('have.css', 'color', 'rgba(0, 0, 0, 0.8)');
            cy.get('.webchat-carousel-template-button')
                .should('have.css', 'color', 'rgb(63, 81, 181)')
                .should('have.css', 'background-color', 'rgb(255, 255, 255)');
        });
        
        it('renders a "list"', () => {
            cy.receiveMessageFixture('list');

            cy.get('.webchat-list-template-header-button')
                .should('have.css', 'background-color', 'rgb(230, 230, 230)')
                .should('have.css', 'color', 'rgba(0, 0, 0, 0.95)');
        });
        
        it('renders an "audio message"', () => {
            cy.receiveMessageFixture('audio');

            cy.get('.webchat-media-template-audio')
                .should('have.css', 'background-color', 'rgb(242, 242, 242)')
                .should('have.css', 'color', 'rgba(0, 0, 0, 0.8)');
        });

        // not necessary, does not render any text/background
        xit('renders a "video message"');
        // not necessary, does not render any text/background
        xit('renders an "image message"');

        it('renders a "date picker"', () => {
            cy.receiveMessageFixture('date-picker');

            cy.get('.webchat-message-row > button')
                .should('have.css', 'border-color', 'rgb(63, 81, 181)')
                .should('have.css', 'border-color', 'rgb(63, 81, 181)');
        });

        it('renders a "quick reply"', () => {
            cy.fixture('messages/quick-replies.json').then(quickReplyMessages => {
                const { text, data, source } = quickReplyMessages[0];

                cy.receiveMessage(text, data, source);

                cy.get('.webchat-quick-reply-template-header-message')
                    .should('have.css', 'background-color', 'rgb(255, 255, 255)');
            });
        });
    });

    describe('primary', () => {
        beforeEach(() => {
            cy.visitWebchat();

            cy.initMockWebchat({
                settings: {
                    sourceColorMapping: {
                        agent: 'primary',
                        user: 'primary',
                        bot: 'primary'
                    }
                }
            });

            cy.openWebchat();
        });

        it('renders a "text with buttons"', () => {
            cy.receiveMessageFixture('buttons');

            cy.get('.webchat-buttons-template-root').should('have.css', 'background', 'rgba(0, 0, 0, 0) linear-gradient(185deg, rgb(73, 91, 191), rgb(63, 81, 181)) repeat scroll 0% 0% / auto padding-box border-box');
            cy.get('.webchat-buttons-template-root').should('have.css', 'color', 'rgba(255, 255, 255, 0.95)');
        });

        it('renders a "quick reply"', () => {
            cy.fixture('messages/quick-replies.json').then(quickReplyMessages => {
                const { text, data, source } = quickReplyMessages[0];

                cy.receiveMessage(text, data, source);

                cy.get('.webchat-quick-reply-template-header-message')
                    .should('have.css', 'background', 'rgba(0, 0, 0, 0) linear-gradient(185deg, rgb(73, 91, 191), rgb(63, 81, 181)) repeat scroll 0% 0% / auto padding-box border-box');
            });
        });

        it('renders a "text with buttons"', () => {
            cy.receiveMessageFixture('buttons');

            cy.get('.webchat-buttons-template-root').should('have.css', 'background', 'rgba(0, 0, 0, 0) linear-gradient(185deg, rgb(73, 91, 191), rgb(63, 81, 181)) repeat scroll 0% 0% / auto padding-box border-box');
            cy.get('.webchat-buttons-template-root').should('have.css', 'color', 'rgba(255, 255, 255, 0.95)');
        });

        it('renders a "gallery"', () => {
            cy.receiveMessageFixture('gallery');

            cy.get('.webchat-carousel-template-content').should('have.css', 'color', 'rgba(0, 0, 0, 0.8)');
            cy.get('.webchat-carousel-template-button')
                .should('have.css', 'color', 'rgb(63, 81, 181)')
                .should('have.css', 'background-color', 'rgb(255, 255, 255)');
        });

        it('renders a "list"', () => {
            cy.receiveMessageFixture('list');

            cy.get('.webchat-list-template-header-button')
                .should('have.css', 'background-color', 'rgb(63, 81, 181)')
                .should('have.css', 'color', 'rgba(255, 255, 255, 0.95)');
        });

        // is always neutral
        it('renders an "audio message"');
        
        // doesn't have themed content
        it('renders a "video message"');

        // doen't have themed content
        it('renders an "image message"');
        
        it('renders a "date picker"', () => {
            cy.receiveMessageFixture('date-picker');

            cy.get('.webchat-message-row > button')
                .should('have.css', 'border-color', 'rgb(63, 81, 181)')
                .should('have.css', 'border-color', 'rgb(63, 81, 181)');
        });
    });
})