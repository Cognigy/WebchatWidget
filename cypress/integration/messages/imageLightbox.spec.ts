// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../support/index.d.ts" />

describe("Image fullsize with Lightbox", () => {
    beforeEach(() => {
        cy
            .visitWebchat()
            .initMockWebchat()
            .openWebchat()
            .startConversation()
            .submitPrivacyScreen()
    })

    it("should render image preview", () => {
        cy.withMessageFixture('downloadableImage', () => {
            cy.get('.webchat-media-template-image[role=button]').should("be.visible");
        })
    });

    it("should open and close Lightbox with fullsize image", () => {
        cy.withMessageFixture('downloadableImage', () => {
            cy.get('[role="dialog"]').should("not.exist");

            cy.get('.webchat-media-template-image[role=button]').click();
            cy.get('[role="dialog"]').should("exist");

            cy.get('[aria-label="Close fullsize image modal"]').click();
            cy.get('[role="dialog"]').should("not.exist");
        })
    });
})