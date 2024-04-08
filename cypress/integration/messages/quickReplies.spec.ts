// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../support/index.d.ts" />

describe("Message with Quick Replies", () => {

    beforeEach(() => cy
        .visitWebchat()
        .initMockWebchat()
        .openWebchat()
        .startConversation()
    )

    it("should render message with quick replies", () => {
        cy.withMessageFixture('quick-replies', () => {
            cy
                .contains("foobar003");
            cy
                .contains("foobar003qr01")
            cy
                .contains("foobar003qr02")
        })
    })

    it.only("should click the quick reply and post as user message", () => {
        cy.withMessageFixture('quick-replies', () => {
            cy.get("button:contains('foobar003qr01')").last().focus();
            cy.get("button:contains('foobar003qr01')").last().click();
            cy.get(".webchat-message-row.user")
                .contains("foobar003qr01");
        });
    })

    // we have no button images on v3
    xit("should render image inside quick replies button", () => {
        cy.withMessageFixture('quick-replies', () => {
            cy.contains("foobar003qr02").children("img").should("have.length", 1);   
            
        });
    })

    // we have no button images on v3
    xit("should render image alt text when present", () => {
        cy.withMessageFixture('quick-replies', () => {
            cy.contains("foobar003qr02").children("img").should("have.attr", "alt")
                .then(alttext => {
                    expect(alttext).to.be.eq("alt text");
                });   
            
        });
    })

    it("should have role 'group' when more than one quick reply button", () => {
        cy.withMessageFixture('quick-replies', () => {
            cy.get(".webchat-quick-reply-template-replies-container")
                .should("have.attr", "role", "group");
            
        });
    })

    it("quick reply button group should have 'aria-labelledby' attribute", () => {
        cy.withMessageFixture('quick-replies', () => {
            cy.get(".webchat-quick-reply-template-replies-container")
                .invoke("attr", "aria-labelledby")
                .should("contain", "webchatButtonTemplateHeader")
                .should("contain", "srOnly-webchatButtonTemplateHeader");
            
        });
    })

    it("quick reply button should have 'aria-label' attribute with button position and name", () => {
        cy.withMessageFixture('quick-replies', () => {
            cy.contains("foobar003qr01")
                .invoke("attr", "aria-label")
                .should("contain", "Item 1 of 2: foobar003qr01");
            cy.contains("foobar003qr02")
                .invoke("attr", "aria-label")
                .should("contain", "Item 2 of 2: foobar003qr02");
            
        });
    })
})