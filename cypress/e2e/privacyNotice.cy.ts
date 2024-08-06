describe("Privacy Notice", () => {
	beforeEach(() => {
		cy.visitWebchat();
	});

	it("shows privacy notice screen when configured", () => {
		cy.initMockWebchat({
			settings: {
				privacyNotice: {
					enabled: true,
				},
			},
		});

		cy.openWebchat();
		cy.startConversation();
		cy.get(".webchat-privacy-notice-root").should("be.visible");
	});

	it("allows title customization", () => {
		cy.initMockWebchat({
			settings: {
				privacyNotice: {
					enabled: true,
					title: "Privacy notice 321",
				},
			},
		});

        cy.openWebchat();
		cy.startConversation();
		cy.get(".webchat-header-title").should("have.text", "Privacy notice 321");
	});

	it("allows text customization", () => {
		cy.initMockWebchat({
			settings: {
				privacyNotice: {
					enabled: true,
					text: "Custom text here 123",
				},
			},
		});

        cy.openWebchat();
		cy.startConversation();
		cy.get(".webchat-privacy-notice-message").should("have.text", "Custom text here 123");
	});

	it("allows privacy policy link text customization", () => {
		cy.initMockWebchat({
			settings: {
				privacyNotice: {
					enabled: true,
					urlText: "URL text here 123",
				},
			},
		});

        cy.openWebchat();
		cy.startConversation();
		cy.get(".tertiary-button").should("have.text", "URL text here 123");
	});

	it("allows privacy policy link url customization", () => {
		cy.initMockWebchat({
			settings: {
				privacyNotice: {
					enabled: true,
					url: "https://cognigy.com",
				},
			},
        });
        
        cy.openWebchat();
        cy.startConversation();

		cy.window().then(win => {
			cy.stub(win, "open")
				.callsFake(url => {
					win.location.href = url;
				})
				.as("windowOpen");
		});

		cy.get(".tertiary-button").click();
		cy.get("@windowOpen").should("be.calledOnce");
		cy.get("@windowOpen").should("be.calledWith", "https://cognigy.com");

	});
});
