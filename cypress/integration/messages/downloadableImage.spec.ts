/// <reference path="../../support/index.d.ts" />

describe("Message with Downloadable Image", () => {
    beforeEach(() => {
        cy
            .visitWebchat()
            .initMockWebchat()
            .openWebchat()
    })

    it("should render image", () => {
        cy.withMessageFixture('downloadableImage', () => {
            cy
                .get(".webchat-message-row > div > div").should("have.css", "background-image");
        })
    });

	it("should render download button", () => {
        cy.withMessageFixture('downloadableImage', () => {
            cy
                .get("button").contains("Download");
        })
    });
})