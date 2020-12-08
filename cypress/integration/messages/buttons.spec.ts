/// <reference path="../../support/index.d.ts" />

describe("Message with Buttons", () => {
    beforeEach(() => {
        cy
            .visitBuild()
            .initMockWebchat()
            .openWebchat()
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
            cy.contains("foobar005b1").click().get(".regular-message.user").contains("foobar005b1")
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
			cy.get("[role=group] .webchat-buttons-template-button").should("have.length", 4);
        })				
    })
})