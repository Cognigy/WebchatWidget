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
                adaptivecards: {
                    FoodChoice: "Steak",
                    SteakTemp: "medium-rare",
                    SteakOther: "Tender, please!"
                }
            }});
        });
    });

    it("renders a hyperlink when rendering markdown markup", () => {
        cy.withMessageFixture('adaptivecard-markdown', () => {
            cy.contains("Here's some text with markdown syntax and a hyperlink embedded right into it.").should("be.visible");

            cy.contains("strong", "markdown").should('be.visible');

            cy.contains("a", "hyperlink").then((anchor) => {
                expect(anchor.attr('href')).to.equal("https://example.org");
            });
        });
    });   
    
    it("navigates when clicking an Action.OpenUrl button", () => {
        cy.withMessageFixture('adaptivecard-actions', () => {
            cy.window().then(window => {
                cy.stub(window, 'open').as("winOpen");
            });
            
            cy.contains("Open Example Page").click();

            cy.get("@winOpen").then(open => {
                expect(open).to.be.calledOnceWith("https://example.org", "_blank");
            })
        });
    });
});