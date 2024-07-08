// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../support/index.d.ts" />

describe("xApps Overlay", () => {
    beforeEach(() => {
        cy
            .visitWebchat()
            .initMockWebchat()
            .openWebchat()
            .startConversation()
    })

    it("opens overlay automatically", () => {
        cy.withMessageFixture('xApps-overlay-autoOpen', () => {
            cy.get('.logoNameContainer').contains('XApp Title 1');
        })
    })

    it("closes overlay on close-button click", () => {
        cy.withMessageFixture('xApps-overlay-autoOpen', () => {
            cy.get('.webchat-header-close-button').click();
        })
    })

    it("changes title on switching apps", () => {
        cy.withMessageFixture('xApps-overlay-autoOpen', () => {
            cy.wait(1000);
            cy.receiveMessage(null, {
                "_cognigy": {
                    "_app": {
                        "overlaySettings": {
                            "screenTitle": "XApp Title 2",
                        },
                        "url": "https://example.com"
                    }
                }
            });
            cy.get('.logoNameContainer').contains('XApp Title 2');
        })
    })

    it("makes xApp fullscreen when no title and no close icon", () => {
        cy.withMessageFixture('xApps-overlay-noClose', () => {
            cy.get('.webchat-header-bar').should('not.exist');
        })
    })
})