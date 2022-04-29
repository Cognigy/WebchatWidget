describe("Message with AdaptiveCard", () => {
    describe("", () => {

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

                cy.getMessageFromHistory({
                    data: {
                        adaptivecards: {
                            FoodChoice: "Steak",
                            SteakTemp: "medium-rare",
                            SteakOther: "Tender, please!"
                        }
                    }
                });
            });
        });
    });

    it("prefers the sideoaded adaptivecards plugin over the internal one", () => {
        cy.visitWebchat();
        cy.loadJavaScriptFixture("adaptivecards.webchat-plugin.js");
        cy.initMockWebchat();
        cy.openWebchat();

        cy.receiveMessageFixture("adaptivecard");

        cy.contains("Your registration is almost complete").should("be.visible");
        cy.get(".adaptivecard-wrapper.internal").should("not.exist");
    });

    it("uses the internal adaptivecards plugin if no other is sideloaded", () => {
        cy.visitWebchat();
        cy.initMockWebchat();
        cy.openWebchat();

        cy.receiveMessageFixture("adaptivecard");

        cy.contains("Your registration is almost complete").should("be.visible");
        cy.get(".adaptivecard-wrapper.internal").should("be.visible");
    });
});