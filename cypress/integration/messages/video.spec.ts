/// <reference path="../../support/index.d.ts" />

describe("Message with Video", () => {
    beforeEach(() => {
        cy
            .visitBuild()
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
                .get(".webchat-message-row > div >  .webchat-media-template-video");
        })
    })
})