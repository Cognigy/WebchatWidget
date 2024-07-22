describe("RTL Localization", () => {
	beforeEach(() => {
		cy.visitWebchat();
		cy.initMockWebchat();
		cy.setRTLDocument();
	});
	it("should render toggle button on the left", () => {
		cy.get(".webchat-toggle-button").should("have.css", "left", "20px");
	});

	it("should render webchat window on the left", () => {
		cy.get(".webchat-toggle-button").click();
		cy.get(".webchat").should("have.css", "left", "20px");
	});

	it("should render close button on the left", () => {
		cy.get(".webchat-toggle-button").click();
		cy.startConversation();
		cy.get(".webchat-header-close-button").then(element => {
			const rect = element[0].getBoundingClientRect();
			expect(rect.top).to.be.closeTo(0, 100);
			expect(rect.left).to.be.closeTo(0, 100);
		});
	});

	it("should render bot message on the right", () => {
		cy.get(".webchat-toggle-button").click();
		cy.startConversation();
		cy.receiveMessage("Hello");
		cy.get(".chat-bubble").then(element => {
			const rect = element[0].getBoundingClientRect();
			expect(rect.right).to.be.closeTo(0, 100);
		});
	});
});
