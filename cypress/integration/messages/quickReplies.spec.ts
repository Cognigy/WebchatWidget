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

    it("should render message with quick replies stored behind a pointer", () => {
        cy.withMessageFixture('intent-default-reply-with-quick-replies', () => {
            cy
                .contains("Regarding Insurance I have the following topics.");
            cy
                .contains("Insurance overview")
                cy
                .contains("Hospitalization claim")
                cy
                .contains("Travel insurance claim")
                cy
                .contains("Specialist Claim")
                cy
                .contains("List of panel doctor/specialist clinic")
                cy
                .contains("A&E Claim")
                cy
                .contains("Supreme (insurance) card")
                cy
                .contains("Non-panel clinic")
        }, reInit)
    })

    it("should click the quick reply stored behind a pointer and post as user message", () => {
        cy.withMessageFixture('intent-default-reply-with-quick-replies', () => {
            cy
                .contains("Insurance overview").click()
            cy
                .get(".regular-message.user")
                .contains("Insurance overview");
        }, reInit);
    })
})