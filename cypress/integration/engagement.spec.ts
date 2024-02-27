// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../support/index.d.ts" />

describe("Engagement Message", () => {
	it("should display an engagement message if engagementMessageText is configured", () => {
		cy.visitWebchat().initMockWebchat({
			settings: {
				teaserMessage: {
					text: "engagement message text",
				},
				unreadMessages: {
					enablePreview: false,
				},
			},
		});

		cy.window().contains("engagement message text", { timeout: 6000 }).should("be.visible");
	});

	it("should show an engagement message with a custom delay if engagementMessageDelay is configured", () => {
		cy.visitWebchat().initMockWebchat({
			settings: {
				teaserMessage: {
					text: "engagement message text",
				},
				unreadMessages: {
					enablePreview: false,
				},
				widgetSettings: {
					teaserMessageDelay: 1
				}
			},
		});

		cy.window().contains("engagement message text", { timeout: 500 }).should("be.visible");
	});

	it("should not show an engagement message if engagementMessageText is not configured", () => {
		cy.visitWebchat().initMockWebchat({
			settings: {
				unreadMessages: {
					enablePreview: false,
				},
				widgetSettings: {
					teaserMessageDelay: 1
				}
			},
		});

		cy.wait(500);
		cy.window().contains("engagement message text", { timeout: 500 }).should("not.exist");
	});

	it("should not trigger the engagement message if the webchat is open", () => {
		cy.visitWebchat()
			.initMockWebchat({
				settings: {
					teaserMessage: {
						text: "engagement message text",
					},
					unreadMessages: {
						enablePreview: false,
					},
					widgetSettings: {
						teaserMessageDelay: 1
					}
				},
			})
			.openWebchat()
			.startConversation();

		cy.wait(500);
		cy.window().contains("engagement message text", { timeout: 0 }).should("not.exist");
	});

	it("should not trigger the engagement message if the webchat has been open before", () => {
		cy.visitWebchat().initMockWebchat({
			settings: {
				teaserMessage: {
					text: "engagement message text",
				},
				unreadMessages: {
					enablePreview: false,
				},
				widgetSettings: {
					teaserMessageDelay: 1
				}
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
					teaserMessage: {
						text: "engagement message text",
					},
					unreadMessages: {
						enablePreview: false,
					},
					widgetSettings: {
						teaserMessageDelay: 1
					}
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
				teaserMessage: {
					text: "engagement message text",
				},
				unreadMessages: {
					enablePreview: false,
				},
				widgetSettings: {
					teaserMessageDelay: 1
				}
			},
		});
		cy.receiveMessage("hello there");
		cy.wait(500);

		cy.contains("engagement message text", { timeout: 0 }).should("not.exist");
	});

	it("should not show the engagement message in the history", () => {
		cy.visitWebchat().initMockWebchat({
			settings: {
				teaserMessage: {
					text: "engagement message text",
				},
				unreadMessages: {
					enablePreview: false,
				},
				widgetSettings: {
					teaserMessageDelay: 1
				}
			},
		});
		cy.wait(500);

		cy.contains("engagement message text").should("be.visible");

		cy.get("[data-cognigy-webchat-toggle]").click();
		cy.wait(100);

		cy.contains("engagement message text").should("not.exist");
	});

	// TODO: This test is not working as expected as teaser messages are not shown in the history
	xit("should display the engagement message in the history if showInChat is true", () => {
		cy.visitWebchat().initMockWebchat({
			settings: {
				teaserMessage: {
					text: "engagement message text",
					showInChat: true
				},
				unreadMessages: {
					enablePreview: false,
				},
				widgetSettings: {
					teaserMessageDelay: 100
				}
			},
		});
		cy.wait(100);

		cy.contains("engagement message text").should("be.visible");

		cy.get("[data-cognigy-webchat-toggle]").click();
		cy.get("[aria-label='Start chat']").click();

		cy.contains("engagement message text").should("be.visible");
	});
});
