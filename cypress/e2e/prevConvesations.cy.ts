describe("Previous Conversations", () => {
	beforeEach(() => {
		cy.visitWebchat();
	});

	it("is possible to navigate to empty convesration list from Home Screen", () => {
		cy.initMockWebchat({
			settings: {
				homeScreen: {
					enabled: true,
					previousConversations: {
						enabled: true,
						buttonText: "View previous conversations",
					},
				},
			},
		});
		cy.openWebchat();
		cy.get("button").contains("View previous conversations").click();
		cy.get(".webchat-prev-conversations-content").should("exist");

		// it should be empty list
		cy.get(".webchat-prev-conversations-item").should("have.length", 0);
	});

	it("should list a new conversation", () => {
		cy.session("default1", () => {
			const localOptions = {
				userId: `user-1`,
				sessionId: `session-1`,
				channel: `channel-1`,
			};

			cy.window().then(window => {
				window.localStorage.clear();
			});

			cy.visitWebchat();
			cy.initWebchat(localOptions).openWebchat().startConversation();
			cy.sendMessage("hello");
			cy.contains('You said "hello".').should("be.visible");

            // list contains 1 item
			cy.get("button.webchat-header-back-button").should("exist").click();
			cy.get("button").contains("Previous conversations").click();
			cy.get(".webchat-prev-conversations-item").should("have.length", 1);

			// check if conversation persists after page reload
			cy.reload();
			cy.initWebchat(localOptions).openWebchat();
			cy.get("button").contains("Previous conversations").click();
			cy.get(".webchat-prev-conversations-content").should("exist");
			cy.get(".webchat-prev-conversations-item").should("have.length", 1);
		});
	});

	it("is possible to continue a previous conversation", () => {
		cy.session("default2", () => {
			const localOptions = {
				userId: `user-1`,
				sessionId: `session-1`,
				channel: `channel-1`,
			};

			const key = [
				"channel-1",
				"user-1",
				"session-1",
				"5e51fcdc2c10fe4c5267c8a798a7134086f60b62998062af620ed73b096e25bd",
            ];

            cy.window().then(window => {
                window.localStorage.clear();
                cy.fixture("prevConversations.json").then(jsonData => {
                    window.localStorage.setItem(JSON.stringify(key), JSON.stringify(jsonData));
                });
            });

			cy.visitWebchat();
			cy.initWebchat(localOptions).openWebchat();
			cy.get("button").contains("Previous conversations").click();
			cy.get(".webchat-prev-conversations-content").should("exist");
			cy.get(".webchat-prev-conversations-item").should("have.length", 1);

			// go to the first conversation
			cy.get(".webchat-prev-conversations-item").eq(0).click();

			cy.sendMessage("hello 2");
			cy.contains('You said "hello 2".').should("be.visible");
		});
	});

	it("is not possible to continue expired previous conversation", () => {
		cy.session("default3", () => {
			const localOptions = {
				userId: `user-1`,
				sessionId: `session-1`,
				channel: `channel-1`,
			};

			const key = [
				"channel-1",
				"user-1",
				"session-1",
				"5e51fcdc2c10fe4c5267c8a798a7134086f60b62998062af620ed73b096e25bd",
            ];
            
            cy.window().then(window => {
                window.localStorage.clear();
                cy.fixture("prevConversationsExpired.json").then(jsonData => {
                    window.localStorage.setItem(JSON.stringify(key), JSON.stringify(jsonData));
                });
            });

			cy.visitWebchat();
			cy.initWebchat(localOptions).openWebchat();
			cy.get("button").contains("Previous conversations").click();
			cy.get(".webchat-prev-conversations-content").should("exist");
			cy.get(".webchat-prev-conversations-item").should("have.length", 1);

			// go to the first conversation
			cy.get(".webchat-prev-conversations-item").eq(0).click();

			cy.contains("Conversation ended").should("be.visible");
			cy.get(".webchat-input").should("not.exist");
		});
	});
});
