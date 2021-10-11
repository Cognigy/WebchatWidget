/// <reference path="../../support/index.d.ts" />

describe("Message with Video", () => {
    beforeEach(() => {
        cy
            .visitWebchat()
            .initMockWebchat()
            .openWebchat()
    })

    it("should render video player", () => {
        cy.withMessageFixture('video', () => {
            cy
                .get(".webchat-message-row video").should("be.visible");
        })
    })

    it("should have controls in player", () => {
        cy.withMessageFixture('video', () => {
            cy
                .get(".webchat-message-row video").should("have.attr", "controls");
        })
    })

    it("should have class 'webchat-media-template-video'", () => {
        cy.withMessageFixture('video', () => {
            cy
                .get(".webchat-message-row .webchat-media-template-video");
        })
	})
	
	it("should have sr-only default alternate text for video", () => {
        cy.withMessageFixture('video', () => {
            cy
				.get(".webchat-message-row .webchat-media-template-video .sr-only")
				.contains("Attachment Video")
				.should("not.be.visible");
        })
	})
})