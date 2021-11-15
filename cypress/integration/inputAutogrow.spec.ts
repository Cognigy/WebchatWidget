describe('Input Autogrow', () => {
    it('should be active by default', () => {
        cy.visitWebchat().initMockWebchat().openWebchat();

        cy.get('textarea.webchat-input-message-input').should('be.visible');
    });

    it('should submit when hitting "return"', () => {
        cy.visitWebchat().initMockWebchat().openWebchat();

        cy.get('#webchatInputMessageInputInTextMode').as('input');
        cy.get('@input').type('hello world{enter}');

        cy.get('.regular-message.user').contains('hello world').should('be.visible');
    });

    it('should grow when typing long texts', () => {
        cy.visitWebchat().initMockWebchat().openWebchat();

        cy.get('#webchatInputMessageInputInTextMode').as('input');
        cy.get('@input').invoke('height').as('initialHeight');
        cy.get('@input').type('this is a long text that will most likely cause the field to wrap');
        cy.get('@initialHeight').then(initialHeight => {
            cy.get('@input').invoke('height').should('be.above', initialHeight);
        });
    });

    it('should insert a newline when sending "shift+return"', () => {
        cy.visitWebchat().initMockWebchat().openWebchat();

        cy.get('#webchatInputMessageInputInTextMode').as('input');
        cy.get('@input').invoke('height').as('initialHeight');
        cy.get('@input').type('{shift}{enter}');
        cy.get('@initialHeight').then(initialHeight => {
            cy.get('@input').invoke('height').should('be.above', initialHeight);
        });
    });

    it('should grow up to "inputAutogrowMaxLines" lines before scrolling', () => {
        cy.visitWebchat().initMockWebchat({
            settings: {
                inputAutogrowMaxRows: 3
            }
        }).openWebchat();

        cy.get('#webchatInputMessageInputInTextMode').as('input')
            .invoke('height').as('initialHeight');

        cy.get('@input')
            .type('{shift}{enter}{enter}')
            .invoke('height').as('maxLinesHeight')
            .then(maxLinesHeight => {
                cy.get('@initialHeight').should('be.below', maxLinesHeight)
            });

        
        cy.get('@input')
            .type('{shift}{enter}')
            .invoke('height').as('aboveMaxLinesHeight')
            .then(aboveMaxLinesHeight => {
                cy.get('@maxLinesHeight').should('equal', aboveMaxLinesHeight);
            });
    });

    it('should use an "input" element if "disableInputAutogrow" flag is set', () => {
        cy.visitWebchat().initMockWebchat({
            settings: {
                disableInputAutogrow: true
            }
        }).openWebchat();

        cy.get('input#webchatInputMessageInputInTextMode').should('be.visible');
    });
})