/// <reference path="../../support/index.d.ts" />

describe("Text message", () => {
    beforeEach(() => {
        cy
            .visitWebchat()
            .initMockWebchat()
            .openWebchat()
    })

    it("should render text message", () => {
        cy.withMessageFixture('text', () => {
            cy
                .contains("foobar001");
        })
    })

    it("should render multiline text message", () => {
        cy.withMessageFixture('text-multiline', () => {
            cy
                .contains(/foobar002\sbarfoo002/)
                .get('.regular-message')
                .should('have.css', 'white-space')
                .and('match', /pre-wrap/);
        })
    })

    it("should render html in text message", () => {
        cy.withMessageFixture('text-html', () => {
            cy
                .contains("foobar010")
                .get('.regular-message > h1')
                .get('.regular-message > div')
                .contains('foobar010red')
                .should('have.css', 'background');
        })
    })
})