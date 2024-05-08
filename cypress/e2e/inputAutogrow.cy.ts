describe("Input Autogrow", () => {
	beforeEach(() => {
		cy.visitWebchat().initMockWebchat().openWebchat().startConversation();
	});

	it("should be active by default", () => {
		cy.get("textarea.webchat-input-message-input").should("be.visible");
	});

	it('should submit when hitting "return"', () => {
		cy.get("#webchatInputMessageInputInTextMode").as("input");
		cy.get("@input").type("hello world{enter}");

		cy.get(".webchat-message-row.user").contains("hello world").should("be.visible");
	});

	it("should grow when typing long texts", () => {
		cy.get("#webchatInputMessageInputInTextMode").as("input");
		cy.get("@input")
			.invoke("height")
			.then(initialHeight => {
				cy.get("@input").type(
					"this is a long text that will most likely cause the field to grow in height. Let's see if it does!`",
				);
				cy.get("@input").invoke("height").should("be.above", initialHeight);
			});
	});

	it('should insert a newline when sending "shift+return"', () => {
		cy.get("#webchatInputMessageInputInTextMode").as("input");
		cy.get("@input")
			.invoke("height")
			.then(initialHeight => {
				cy.get("@input").type("{shift}{enter}");
				cy.get("@input").invoke("height").should("be.above", initialHeight);
			});
	});

	it('should grow up to "inputAutogrowMaxLines" lines before scrolling', () => {
		cy.visitWebchat()
			.initMockWebchat({
				settings: {
					layout: {
						inputAutogrowMaxRows: 3,
					},
				},
			})
			.openWebchat()
			.startConversation();

		cy.get("#webchatInputMessageInputInTextMode")
			.as("input")
			.invoke("height")
			.then(initialHeight => {
				cy.get("@input")
					.type("{shift}{enter}{enter}")
					.invoke("height")
					.then(maxLinesHeight => {
						expect(initialHeight).to.be.below(maxLinesHeight);
						cy.get("@input")
							.type("{shift}{enter}")
							.invoke("height")
							.then(aboveMaxLinesHeight => {
								expect(maxLinesHeight).to.be.equal(aboveMaxLinesHeight - 1);
							});
					});
			});
	});
});
