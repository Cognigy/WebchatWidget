// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../support/index.d.ts" />

describe("Message with Image", { retries: 3 }, () => {
	beforeEach(() => {
		cy.visitWebchat().initMockWebchat().openWebchat().startConversation();
	});

	it("should render image", () => {
		cy.withMessageFixture("image", () => {
			cy.get(".webchat-message-row > div > img").should("be.visible");
		});
	});

	it("should have class 'webchat-media-template-image'", () => {
		cy.withMessageFixture("image", () => {
			cy.get(".webchat-message-row .webchat-media-template-image");
		});
	});

	it("should have alt attibute", () => {
		cy.withMessageFixture("image", () => {
			cy.get(".webchat-message-row > div > img")
				.should("have.attr", "alt")
				.and("match", /Attachment Image/);
		});
	});

	it("should render the image in a fixed aspect ratio", () => {
		cy.withMessageFixture("image", () => {
			cy.get(".webchat-media-template-image > img")
				.should("be.visible")
				.then(element => {
					const imageRatio = (element.innerWidth() / element.innerHeight()).toFixed(1);
					const targetRatio = (16 / 9).toFixed(1);
					expect(imageRatio).to.equal(targetRatio);
				});
		});
	});

	it("should render the image in a dynamic aspect ratio", () => {
		cy.visitWebchat();
		cy.initMockWebchat({
			settings: {
				layout: {
					dynamicImageAspectRatio: true,
				},
			},
		});
		cy.openWebchat();
		cy.startConversation();

		cy.withMessageFixture("image", () => {
			cy.get(".webchat-media-template-image > img")
				.should("be.visible")
				.then(element => {
					expect(element.innerHeight().toFixed()).to.equal(
						element.innerWidth().toFixed(),
					);
				});
		});
	});
});
