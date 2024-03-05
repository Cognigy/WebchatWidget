// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../support/index.d.ts" />

describe("Text message", () => {
    beforeEach(() => {
        cy
            .visitWebchat()
            .initMockWebchat()
            .openWebchat()
            .startConversation()
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
                .get('.webchat-message-row .chat-bubble')
                .should('have.css', 'white-space')
                .and('match', /pre-wrap/);
        })
    })

    it("should render html in text message", () => {
        cy.withMessageFixture('text-html', () => {
            cy
                .contains("foobar010")
                .get('.webchat-message-row .chat-bubble > div h1')
                .get('.webchat-message-row .chat-bubble > div > div')
                .contains('foobar010red')
                .should('have.css', 'background');
        })
    })
})