describe("When Input is Focused", () => {
	it("Sends postback on click", () => {
		cy.visitWebchat();
		cy.initMockWebchat();
		cy.openWebchat();
		cy.startConversation();

		cy.fixture("messages/buttons.json").then(({ text, data, source }) => {
			cy.receiveMessage(text, data, source);
		});

		cy.focusInput();
		cy.contains("foobar005b1").click();
		cy.get(".webchat-message-row.user").contains("foobar005b1").should("be.visible");
	});
});
