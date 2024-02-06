// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../support/index.d.ts" />

describe("Message with Audio", () => {
    beforeEach(() => {
        cy
            .visitWebchat()
            .initMockWebchat()
            .openWebchat()
            .startConversation()
            .submitPrivacyScreen()
    })

    it("should render audio player", () => {
        cy.withMessageFixture('audio', () => {
            cy.get(".webchat-message-row audio").should("exist")
            cy.get(".webchat-message-row audio").should("not.be.visible");
        })
    })

    it("should have controls in player", () => {
        cy.withMessageFixture('audio', () => {
            cy.get(".webchat-message-row div[data-testid='audio-controls']").should("be.visible");
        })
    })

    it("should have class 'webchat-media-template-audio'", () => {
        cy.withMessageFixture('audio', () => {
            cy.get(".webchat-message-row .webchat-media-template-audio");
        })
	})

	it("should have sr-only default alternate text for audio", () => {
        cy.withMessageFixture('audio', () => {
            cy
				.get(".webchat-message-row .webchat-media-template-audio span")
				.contains("Attachment Audio")
				.should("not.be.visible");
        })
	})	
	
})