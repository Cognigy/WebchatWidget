/// <reference path="../../support/index.d.ts" />

describe("Message with AdaptiveCard", () => {
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

    it("submits a message through an adaptivecard form", () => {
        cy.withMessageFixture('adaptivecard', () => {
            cy.contains("Your registration is almost complete").should("be.visible");

            cy.contains("Steak").click();
            cy.contains("Medium-Rare").click();
            cy.get("#SteakOther textarea").type("Tender, please!");
            cy.contains("OK").click();

            cy.getMessageFromHistory({ data: {
                "adaptivecards": {
                    "FoodChoice": "Steak"
                }
            }})
        });
    });
});