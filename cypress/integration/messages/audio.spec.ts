/// <reference path="../../support/index.d.ts" />

describe("Message with Audio", () => {
    beforeEach(() => {
        cy
            .visitWebchat()
            .initMockWebchat()
            .openWebchat()
    })

    it("should render audio player", () => {
        cy.withMessageFixture('audio', () => {
            cy
                .get(".webchat-message-row audio").should("be.visible");
        })
    })

    it("should have controls in player", () => {
        cy.withMessageFixture('audio', () => {
            cy
                .get(".webchat-message-row audio").should("have.attr", "controls");
        })
    })

    it("should have class 'webchat-media-template-audio'", () => {
        cy.withMessageFixture('audio', () => {
            cy
                .get(".webchat-message-row .webchat-media-template-audio");
        })
	})

	it("should have sr-only default alternate text for audio", () => {
        cy.withMessageFixture('audio', () => {
            cy
				.get(".webchat-message-row .webchat-media-template-audio .sr-only")
				.contains("Attachment Audio")
				.should("not.be.visible");
        })
	})	
	
})