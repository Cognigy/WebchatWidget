// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../support/index.d.ts" />

describe("Engagement Message", () => {
	it("should display an engagement message if engagementMessageText is configured", () => {
		cy.visitWebchat().initMockWebchat({
			settings: {
				enableUnreadMessagePreview: true,
				engagementMessageText: "engagement message text",
			},
		});

		cy.window().contains("engagement message text", { timeout: 6000 }).should("be.visible");
	});

	it("should show an engagement message with a custom delay if engagementMessageDelay is configured", () => {
		cy.visitWebchat().initMockWebchat({
			settings: {
				enableUnreadMessagePreview: true,
				engagementMessageDelay: 1,
				engagementMessageText: "engagement message text",
			},
		});

		cy.window().contains("engagement message text", { timeout: 500 }).should("be.visible");
	});

	it("should not show an engagement message if engagementMessageText is not configured", () => {
		cy.visitWebchat().initMockWebchat({
			settings: {
				enableUnreadMessagePreview: true,
				engagementMessageDelay: 1,
			},
		});

		cy.wait(500);
		cy.window().contains("engagement message text", { timeout: 500 }).should("not.exist");
	});

	it("should not trigger the engagement message if the webchat is open", () => {
		cy.visitWebchat()
			.initMockWebchat({
				settings: {
					enableUnreadMessagePreview: true,
					engagementMessageText: "engagement message text",
					engagementMessageDelay: 1,
				},
			})
			.openWebchat()
			.startConversation()
			.submitPrivacyScreen();

		cy.wait(500);
		cy.window().contains("engagement message text", { timeout: 0 }).should("not.exist");
	});

	it("should not trigger the engagement message if the webchat has been open before", () => {
		cy.visitWebchat().initMockWebchat({
			settings: {
				enableUnreadMessagePreview: true,
				engagementMessageText: "engagement message text",
				engagementMessageDelay: 1,
			},
		});
		cy.get("[data-cognigy-webchat-toggle]").click().click();
		cy.wait(500);
		cy.window().contains("engagement message text", { timeout: 0 }).should("not.exist");
	});

	it("should not display an engagement message if the endpoint is disabled", () => {
		cy.visitWebchat().initMockWebchat(
			{
				settings: {
					enableUnreadMessagePreview: true,
					engagementMessageText: "engagement message text",
					engagementMessageDelay: 1,
				},
			},
			{
				active: false,
				URLToken: "fake-url-token",
				settings: {},
			},
		);
		cy.wait(500);
		cy.window().contains("engagement message text", { timeout: 0 }).should("not.exist");
	});

	it("should not display an engagement message if the history is not empty", () => {
		cy.visitWebchat().initMockWebchat({
			settings: {
				enableUnreadMessagePreview: true,
				engagementMessageText: "engagement message text",
				engagementMessageDelay: 1,
			},
		});
		cy.receiveMessage("hello there");
		cy.wait(500);

		cy.contains("engagement message text", { timeout: 0 }).should("not.exist");
	});

	it("should not show the engagement message in the history", () => {
		cy.visitWebchat().initMockWebchat({
			settings: {
				enableUnreadMessagePreview: true,
				engagementMessageText: "engagement message text",
				engagementMessageDelay: 1,
			},
		});
		cy.wait(500);

		cy.contains("engagement message text").should("be.visible");

		cy.get("[data-cognigy-webchat-toggle]").click();
		cy.wait(100);

		cy.contains("engagement message text").should("not.exist");
	});

	it("should display the engagement message in the history if showEngagementMessagesInChat is true", () => {
		cy.visitWebchat().initMockWebchat({
			settings: {
				enableUnreadMessagePreview: true,
				engagementMessageText: "engagement message text",
				engagementMessageDelay: 1,
				showEngagementMessagesInChat: true,
			},
		});
		cy.wait(500);

		cy.contains("engagement message text").should("be.visible");

		cy.get("[data-cognigy-webchat-toggle]").click();
		cy.wait(100);

		cy.startConversation().submitPrivacyScreen();

		cy.contains("engagement message text").should("be.visible");
	});
});
