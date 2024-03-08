// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../support/index.d.ts" />

describe("Message with Buttons", () => {
    beforeEach(() => {
        cy
            .visitWebchat()
            .initMockWebchat()
            .openWebchat()
            .startConversation();
    })

    it("should render message header", () => {
        cy.withMessageFixture('buttons', () => {
            cy
                .contains("foobar005");
        })
    })

    it("should render message buttons", () => {
        cy.withMessageFixture('buttons', () => {
            cy.wrap([1,2,3,4]).each(number => {
                cy.contains(`foobar005b${number}`)
            })
        })
    })

    it("should post in chat on postback button click", () => {
        cy.withMessageFixture('buttons', () => {
            cy.contains("foobar005b1").click();
            cy.get(".webchat-message-row.user").contains("foobar005b1");
        })
    })

    it("should have static class names", () => {
        cy.withMessageFixture('buttons', () => {
            cy
                .get(".webchat-buttons-template-header")
                .get(".webchat-buttons-template-root")
                .get(".webchat-buttons-template-button")
        })
    })

    it("group off buttons should have role 'group'", () => {
        cy.withMessageFixture('buttons', () => {
            cy.get(".webchat-chat-history [role=group] .webchat-buttons-template-button")
                .should("have.length", 4);
        })
    })

    it("button group should have 'aria-labelledby' attribute", () => {
        cy.withMessageFixture('buttons', () => {
            cy.get(".webchat-chat-history [role=group]")
                .invoke("attr", "aria-labelledby")
                .should("contain", "webchatButtonTemplateHeader")
                .should("contain", "srOnly-webchatButtonTemplateHeader");
            
        });
    })

    it("buttons in group should have 'aria-label' attribute with button position and name", () => {
        cy.withMessageFixture('buttons', () => {
            cy.wrap([1,2,3,4]).each(number => {
                cy.contains(`foobar005b${number}`)
                    .invoke("attr", "aria-label")
                    .should("contain", `Item ${number} of 4: foobar005b${number}`);
            })
        })
    })

    it("phone number button should be an anchor element with 'href' attribute", () => {
        cy.withMessageFixture('buttons', () => {
            cy.get('a[aria-label="Item 4 of 4: foobar005b4"]')
            .invoke("attr", "href")
            .should("contain", `tel:000111222`);
        })
    })
})