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

        // it('renders a "quick reply"', () => {
        //     cy.receiveMessageFixture('quick-replies');
        // });

        it('renders a "text with buttons"', () => {
            cy.receiveMessageFixture('buttons');

            cy.get('.webchat-buttons-template-root').should('have.css', 'background', 'rgb(255, 255, 255) none repeat scroll 0% 0% / auto padding-box border-box');
            cy.get('.webchat-buttons-template-root').should('have.css', 'color', 'rgba(0, 0, 0, 0.95)');
        });

        // it('renders a "gallery"', () => {
        //     cy.receiveMessageFixture('gallery');
        // });
        // it('renders a "list"', () => {
        //     cy.receiveMessageFixture('list');
        // });
        // it('renders an "audio message"', () => {
        //     cy.receiveMessageFixture('audio');
        // });
        // it('renders a "video message"', () => {
        //     cy.receiveMessageFixture('video');
        // });
        // it('renders an "image message"', () => {
        //     cy.receiveMessageFixture('image');
        // });
        // it('renders a "date picker"', () => {
        //     cy.receiveMessageFixture('date-picker');
        // });
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

        // it('renders a "quick reply"', () => {
        //     cy.withMessageFixture('', () => {})
        // });
        // it('renders a "text with buttons"', () => {
        //     cy.withMessageFixture('', () => {})
        // });
        // it('renders a "gallery"', () => {
        //     cy.withMessageFixture('', () => {})
        // });
        // it('renders a "list"', () => {
        //     cy.withMessageFixture('', () => {})
        // });
        // it('renders an "audio message"', () => {
        //     cy.withMessageFixture('', () => {})
        // });
        // it('renders a "video message"', () => {
        //     cy.withMessageFixture('', () => {})
        // });
        // it('renders an "image message"', () => {
        //     cy.withMessageFixture('', () => {})
        // });
        // it('renders a "date picker"', () => {
        //     cy.receiveMessageFixture('date-picker');
        // });
    });
})