/// <reference path="../../support/index.d.ts" />

describe("Message with Audio", () => {
    beforeEach(() => {
        cy
            .visitBuild()
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
                .get(".webchat-message-row > .webchat-media-template-audio");
        })
    })
})