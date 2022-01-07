/// <reference path="../../support/index.d.ts" />

describe("Message with Audio", () => {
    beforeEach(() => {
        cy
            .visitWebchat()
            .initMockWebchat()
            .openWebchat()
    })

    it("should render an adaptivecard", () => {
        cy.withMessageFixture('adaptivecard', () => {
            cy.contains("Your registration is almost complete").should("be.visible");
        });
    });
});