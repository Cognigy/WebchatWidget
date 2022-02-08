describe("Message History", () => {
    it("automatically scrolls to bottom for new incoming messages", () => {
        cy.visitWebchat()
            .initMockWebchat()
            .openWebchat();

        cy.then(() => {
            for (let i=0; i<20; i++) {
                cy.receiveMessage(`Message ${i+1}!`);
            }
        });

        cy.contains("Message 20!").should("be.visible");
        cy.contains("Message 1!").should("not.be.visible");
    });

    it("doesn't automatically scrollto bottom for new incoming messages if it wasn't scrolled down before", () => {
        cy.visitWebchat()
            .initMockWebchat()
            .openWebchat();

        cy.then(() => {
            for (let i=0; i<20; i++) {
                cy.receiveMessage(`Message ${i+1}!`);
            }
        });

        cy.contains("Message 1!").scrollIntoView();

        cy.receiveMessage("Message 21!");

        cy.contains("Message 21!").should("not.be.visible");
    });
});