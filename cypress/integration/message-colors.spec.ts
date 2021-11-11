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
        it.only('renders a "list"', () => {
            cy.receiveMessageFixture('list');

            cy.get('.webchat-list-template-header-button')
                .should('have.css', 'background-color', 'rgb(230, 230, 230)')
                .should('have.css', 'color', 'rgba(0, 0, 0, 0.95)');
        });
        xit('renders an "audio message"', () => {
            cy.receiveMessageFixture('audio');
        });
        xit('renders a "video message"', () => {
            cy.receiveMessageFixture('video');
        });
        xit('renders an "image message"', () => {
            cy.receiveMessageFixture('image');
        });
        xit('renders a "date picker"', () => {
            cy.receiveMessageFixture('date-picker');
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

        xit('renders a "quick reply"', () => {
            cy.withMessageFixture('', () => {})
        });
        xit('renders a "text with buttons"', () => {
            cy.withMessageFixture('', () => {})
        });
        xit('renders a "gallery"', () => {
            cy.withMessageFixture('', () => {})
        });
        xit('renders a "list"', () => {
            cy.withMessageFixture('', () => {})
        });
        xit('renders an "audio message"', () => {
            cy.withMessageFixture('', () => {})
        });
        xit('renders a "video message"', () => {
            cy.withMessageFixture('', () => {})
        });
        xit('renders an "image message"', () => {
            cy.withMessageFixture('', () => {})
        });
        xit('renders a "date picker"', () => {
            cy.receiveMessageFixture('date-picker');
        });
    });
})