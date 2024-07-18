describe("Watermark", () => {
	beforeEach(() => {
		cy.visitWebchat().initMockWebchat().openWebchat().startConversation();
	});

	it("	is visible after opening the webchat", () => {
		cy.get('[aria-label^="Powered by Cognigy"]').should("be.visible");
	});

	it("is visible at the end of a long chat history", () => {
		cy.then(() => {
			for (let i = 0; i < 20; i++) {
				cy.receiveMessage(`Message ${i + 1}!`);
			}
		});

		cy.get('[aria-label^="Powered by Cognigy"]').should("be.visible");
	});

	it("is still visible when scrolling up the message history", () => {
		cy.then(() => {
			for (let i = 0; i < 20; i++) {
				cy.receiveMessage(`Message ${i + 1}!`);
			}
		});

		cy.contains("Message 1!").scrollIntoView();
		cy.get('[aria-label^="Powered by Cognigy"]').should("be.visible");
	});

	it("is accessible", () => {
		cy.get("#cognigyBrandingLink").should(
			"have.attr",
			"aria-label",
			"Powered by Cognigy. Opens in new tab",
		);
	});

	it("shouldn't be rendered if disabled by 'watermark: none'", () => {
		cy.visitWebchat();
		cy.initMockWebchat({
			settings: {
				layout: {
					watermark: "none"
				}
			},
		});
		cy.openWebchat();
		cy.startConversation();

		cy.get('[aria-label^="Powered by Cognigy"]').should("not.exist");
	});

	it("can be customized with given text by 'watermark: custom'", () => {
		cy.visitWebchat();
		cy.initMockWebchat({
			settings: {
				layout: {
					watermark: "custom",
					watermarkText: "I LOVE NY",
				}
			},
		});
		cy.openWebchat();
		cy.startConversation();

		cy.get('#cognigyHomeScreenBranding').should("have.text", "I LOVE NY");
	});

	it("should have a static id", () => {
		cy.get("#cognigyBrandingLink").should("have.id", "cognigyBrandingLink");
	});
});
