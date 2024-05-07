describe("Persistent History", () => {
	it("restores a persistent history from LocalStorage", () => {
		cy.session("default1", () => {
			const localOptions = {
				userId: `user-1`,
				sessionId: `session-1`,
				channel: `channel-1`,
				URLToken: "fake-url-token",
			};

			cy.window().then(window => {
				window.localStorage.clear();
			});

			cy.visitWebchat();
			cy.initWebchat(localOptions).openWebchat().startConversation();
			cy.sendMessage("hello");
			cy.contains('You said "hello".').should("be.visible");

			cy.reload();

			cy.window().then(window => {
				expect(window.localStorage.length).to.greaterThan(0);
				expect(window.sessionStorage.length).to.equal(0);
			});
		});
	});

	it("restores a persisted history from SessionStorage when using useSessionStorage", () => {
		cy.session("default2", () => {
			const options = {
				userId: `user-${Math.floor(Math.random() * Date.now())}`,
				sessionId: `session-${Math.floor(Math.random() * Date.now())}`,
				channel: `channel-${Math.floor(Math.random() * Date.now())}`,
				settings: {
					embeddingConfiguration: {
						useSessionStorage: true,
					},
				},
			};

			cy.visitWebchat();

			cy.window().then(window => {
				window.localStorage.clear();
			});

			cy.window().then(window => {
				expect(window.localStorage.length).to.equal(0);
				expect(window.sessionStorage.length).to.equal(0);
			});
			cy.initWebchat(options).openWebchat().startConversation();

			cy.sendMessage("hello");

			cy.contains('You said "hello".').should("be.visible");
			cy.reload();

			cy.window().then(window => {
				expect(window.sessionStorage.length).to.greaterThan(0);
				expect(window.localStorage.length).to.equal(0);
			});
		});
	});
});
