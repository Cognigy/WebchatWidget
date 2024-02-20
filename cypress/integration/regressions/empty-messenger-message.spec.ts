describe("Empty Messenger Message", () => {
    it("Does not crash when rendering an empty Messenger Message", () => {
        cy.visitWebchat().initMockWebchat().openWebchat().startConversation().submitPrivacyScreen();

        cy.receiveMessage("", {
            _cognigy: {
                _webchat: {}
            }
        });
        
        cy.receiveMessage("hi");
        cy.contains("hi").should("be.visible");
    });
});