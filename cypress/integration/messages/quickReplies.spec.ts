/// <reference path="../../support/index.d.ts" />

describe("Message with Quick Replies", () => {

    beforeEach(() => cy
        .visitBuild()
        .initMockWebchat()
        .openWebchat())

    function reInit() {
        cy.visitBuild().initMockWebchat().openWebchat();
    }

    it("should render message with quick replies", () => {
        cy.withMessageFixture('quick-replies', () => {
            cy
                .contains("foobar003");
            cy
                .contains("foobar003qr01")
            cy
                .contains("foobar003qr02")
        }, reInit)
    })

    it("should click the quick reply and post as user message", () => {
        cy.withMessageFixture('quick-replies', () => {
            cy
                .contains("foobar003qr01").click()
            cy
                .get(".regular-message.user")
                .contains("foobar003qr01");
        }, reInit);
    })

    it("should render image inside quick replies button", () => {
        cy.withMessageFixture('quick-replies', () => {
            cy.contains("foobar003qr02").children("img").should("have.length", 1);   
            
        }, reInit);
    })
})