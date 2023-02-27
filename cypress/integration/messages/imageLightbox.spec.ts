/// <reference path="../../support/index.d.ts" />

describe("Image fullsize with Lightbox", () => {
    beforeEach(() => {
        cy
            .visitWebchat()
            .initMockWebchat()
            .openWebchat()
    })

    it("should render image preview", () => {
        cy.withMessageFixture('downloadableImage', () => {
            cy.get('[data-test="image-preview"]').should("be.visible");
        })
    });

    it("should open and close Lightbox with fullsize image", () => {
        cy.withMessageFixture('downloadableImage', () => {
            cy.get('[data-test="image-preview"]').click();
            cy.get('[data-test="image-lightbox"]').should("exist");

            cy.get('[data-test="lightbox-close"]').click();
            cy.get('[data-test="image-lightbox"]').should("not.exist");
        })
    });
})