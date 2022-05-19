/// <reference path="../../support/index.d.ts" />

describe("Message with Quick Replies", () => {

    beforeEach(() => cy
        .visitWebchat()
        .initMockWebchat()
        .openWebchat())

    function reInit() {
        cy.visitWebchat().initMockWebchat().openWebchat();
    }

    it("should render message with quick replies", () => {
        cy.withMessageFixture('quick-replies', () => {
            cy
                .contains("foobar003");
            cy
                .contains("foobar003qr01")
            cy
                .contains("foobar003qr02")
        }, reInit)
    })

    it("should click the quick reply and post as user message", () => {
        cy.withMessageFixture('quick-replies', () => {
            cy
                .contains("foobar003qr01").click()
            cy
                .get(".regular-message.user")
                .contains("foobar003qr01");
        }, reInit);
    })

    it("should render image inside quick replies button", () => {
        cy.withMessageFixture('quick-replies', () => {
            cy.contains("foobar003qr02").children("img").should("have.length", 1);   
            
        }, reInit);
    })

    it("should render image alt text when present", () => {
        cy.withMessageFixture('quick-replies', () => {
            cy.contains("foobar003qr02").children("img").should("have.attr", "alt")
                .then(alttext => {
                    expect(alttext).to.be.eq("alt text");
                });   
            
        }, reInit);
    })

    it("should have role 'group' when more than one quick reply button", () => {
        cy.withMessageFixture('quick-replies', () => {
            cy.get(".webchat-quick-reply-template-replies-container")
                .should("have.attr", "role", "group");
            
        }, reInit);
    })

    it("quick reply button group should have 'aria-labelledby' attribute", () => {
        cy.withMessageFixture('quick-replies', () => {
            cy.get(".webchat-quick-reply-template-replies-container")
                .invoke("attr", "aria-labelledby")
                .should("contain", "webchatQuickReplyTemplateHeader")
                .should("contain", "srOnly-webchatQuickReplyTemplateHeader");
            
        }, reInit);
    })

    it("quick reply button should have 'aria-label' attribute with button position and name", () => {
        cy.withMessageFixture('quick-replies', () => {
            cy.contains("foobar003qr01")
                .invoke("attr", "aria-label")
                .should("contain", "Item 1 of 2: foobar003qr01");
            cy.contains("foobar003qr02")
                .invoke("attr", "aria-label")
                .should("contain", "Item 2 of 2: foobar003qr02");
            
        }, reInit);
    })
})