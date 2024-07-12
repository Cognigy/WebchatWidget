// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../support/index.d.ts" />

const getDummyEvent = payload => ({
	data: {
		_cognigy: {
			_webchat3: {
				type: "queueUpdate",
				payload,
			},
		},
	},
});

describe("Queue Updates", () => {
	beforeEach(() => {
		cy.visitWebchat().initMockWebchat().openWebchat().startConversation();
	});

	it("should render queue updates Alternative Text", () => {
		cy.receiveMessage(
			"",
			getDummyEvent({
				alternativeText: "Alternative Text",
			}),
		);

		cy.get(".webchat-queue-updates").should("be.visible");
		cy.get(".webchat-queue-updates").contains("Alternative Text");
	});

	it("should render queue updates Position and Wait Time", () => {
		cy.receiveMessage(
			"",
			getDummyEvent({
				position: 3,
				estimatedWaitTime: 600000,
			}),
		);

		cy.get(".webchat-queue-updates").should("be.visible");
		cy.get(".webchat-queue-updates").contains("10 minutes");
	});

	it("should render LiveAgent Join event and play bell sound", () => {
		cy.receiveMessage(
			"",
			getDummyEvent({
				position: 3,
				estimatedWaitTime: 600000,
			}),
		);

		cy.get(".webchat-queue-updates").should("be.visible");

		cy.receiveMessage(
			"Hello!",
			{
				_cognigy: {
					_webchat: {
						message: {
							text: "Hello!",
						},
					},
				},
			},
			"agent",
		);

		// Render ChatEvent chip
		cy.get(".webchat-message-row").should("be.visible");
		cy.get(".webchat-message-row").contains("Agent joined");

		// Play bell sound
		cy.get("audio").should(els => {
			let audible = false;
			els.each((_, el) => {
				// console.log(el)
				if (el.duration > 0 && el.id === "uifx-813465923") {
					audible = true;
				}
			});
			expect(audible).to.eq(true);
		});

		// Render agent message
		cy.get(".webchat-message-row.agent").contains("Hello!");
	});
});
