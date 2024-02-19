describe("Branding", () => {
	beforeEach(() => {
		cy.visitWebchat().initMockWebchat().openWebchat().startConversation().submitPrivacyScreen();
	});

	it("banner is visible after opening the webchat", () => {
		cy.get('[aria-label^="Powered by Cognigy"]').should("be.visible");
	});

	it("banner is visible at the end of a long chat history", () => {
		cy.then(() => {
			for (let i = 0; i < 20; i++) {
				cy.receiveMessage(`Message ${i + 1}!`);
			}
		});

		cy.get('[aria-label^="Powered by Cognigy"]').should("be.visible");
	});

	it("banner is still visible when scrolling up the message history", () => {
		cy.then(() => {
			for (let i = 0; i < 20; i++) {
				cy.receiveMessage(`Message ${i + 1}!`);
			}
		});

		cy.contains("Message 1!").scrollIntoView();
		cy.get('[aria-label^="Powered by Cognigy"]').should("be.visible");
	});

	it("banner is accessible", () => {
		cy.get("#cognigyBrandingLink").should(
			"have.attr",
			"aria-label",
			"Powered by Cognigy. Opens in new tab",
		);
	});

    // branding logo is removed in v3
	xit("banner is hidden from screen reader", () => {
		cy.get("#cognigyBrandingLogo").should("have.attr", "aria-hidden", "true");
	});

	it("banner shouldn't be rendered if disabled by disableBranding", () => {
		cy.visitWebchat();
		cy.initMockWebchat({
			settings: {
				disableBranding: true,
			},
		});
		cy.openWebchat();
		cy.startConversation();

		cy.get('[aria-label^="Powered by Cognigy"]').should("not.exist");
	});
});
