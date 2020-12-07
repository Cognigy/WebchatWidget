/// <reference path="../../support/index.d.ts" />

describe("Message with Image", () => {
    beforeEach(() => {
        cy
            .visitBuild()
            .initMockWebchat()
            .openWebchat()
    })

    it("should render image", () => {
        cy.withMessageFixture('image', () => {
            cy
                .get(".webchat-message-row > div > div").should("have.css", "background-image");
        })
    })

    it("should have class 'webchat-media-template-image'", () => {
        cy.withMessageFixture('image', () => {
            cy
                .get(".webchat-message-row .webchat-media-template-image");
        })
	})
	
	it("should have role 'img' and an aria-label", () => {
        cy.withMessageFixture('image', () => {
            cy
				.get("[role=img]");
			cy
                .get('[aria-label="Attachment Image"]');
        })
    })
})