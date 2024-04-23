const supportedMessageFixtures = [
	"adaptivecard",
	"audio",
	"buttons",
	"downloadableImage",
	"gallery",
	"image",
	"list",
	"quick-replies-with-null-quick-replies",
	"text",
	"video",
];

xdescribe("isMessageSupported", () => {
	for (const message of supportedMessageFixtures) {
		it(`returns true for a "${message}" message`, () => {
			cy.visitMessageRenderer();

			cy.fixture(`messages/${message}.json`).then(message => {
				cy.window().then(window => {
					expect(
						// @ts-ignore
						window.MessageRenderer.isMessageSupported(message),
					).to.be.true;
				});
			});
		});
	}

	it("returns false for an empty text message", () => {
		cy.visitMessageRenderer();

		cy.window().then(window => {
			expect(
				// @ts-ignore
				window.MessageRenderer.isMessageSupported({ text: "" }),
			).to.be.false;
		});
	});

	it("returns false for an arbitrary data message", () => {
		cy.visitMessageRenderer();

		cy.window().then(window => {
			expect(
				// @ts-ignore
				window.MessageRenderer.isMessageSupported({
					text: "",
					data: { something: "else" },
				}),
			).to.be.false;
		});
	});
});
