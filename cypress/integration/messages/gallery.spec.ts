/// <reference path="../../support/index.d.ts" />

describe("Message with Gallery", () => {
    beforeEach(() => {
        cy
            .visitWebchat()
            .initMockWebchat()
            .openWebchat()
    })

    it("should render gallery message", () => {
        cy.withMessageFixture('gallery', () => {
            cy
                .contains("foobar004g1")
            cy
                .contains("foobar004g3").should("be.not.visible")
        })
    })

    it("should render image inside gallery", () => {
        cy.withMessageFixture('gallery', () => {
            cy
                .get(".webchat-carousel-template-root > div > div").should("have.css", "background-image")
        })
    })

    it("should render subtitle", () => {
        cy.withMessageFixture('gallery', () => {
            cy
                .contains("foobar004g2")
                .parent()
                .contains(/foobar004g2sub1\sfoobar004g2sub2/)
        })
    })

    it("should have scroll forward button", () => {
        cy.withMessageFixture('gallery', () => {
            cy
                .get(".control-next")
        })
    })
    
    it("should scroll on clicking scroll forward button ", () => {
        cy.withMessageFixture('gallery', () => {
            cy
                .contains("foobar004g2").should("not.be.visible")
                .get(".control-next")
                .click()
            cy
                .contains("foobar004g2").should("be.visible")
            cy
                .contains("foobar004g3").should("not.be.visible")
                .get(".control-next")
                .click()
                .contains("foobar004g2").should("not.exist")
            cy
                .contains("foobar004g3").should("be.visible")

        })
    })
    it("should have scroll backward button", () => {
        cy.withMessageFixture('gallery', () => {
            cy
                .get(".control-prev").should("not.be.visible")
                .get(".control-next")
                .click()
                .get(".control-prev").should("be.visible")
        })
    })

    it("should post in chat on gallery button click", () => {
        cy.withMessageFixture('gallery', () => {
            cy
                .contains("foobar004g1b1")
                .click()
                .get(".regular-message.user").contains("foobar004g1b1")
        })
	})

	it("scroll forward button should have correct aria-label", () => {
        cy.withMessageFixture('gallery', () => {
            cy
				.get('[aria-label="Next Item"]').click()
				.get(".control-prev").should("be.visible")
        })
	})

	it("scroll backward button should have correct aria-label", () => {
        cy.withMessageFixture('gallery', () => {
            cy
				.get('[aria-label="Next Item"]').click()
				.get('[aria-label="Previous Item"]').click()
				.get(".control-next").should("be.visible")
        })
	})    
    
    it("should render the gallery image in a fixed aspect ratio", () => {
        cy.withMessageFixture('gallery', () => {
            cy.get(".webchat-carousel-template-frame [role=img]").parent().then(element => {
                expect(element.innerHeight()).to.equal(element.innerWidth() / 2);
            });
        })
    });

    it("should render the gallery image in a dynamic aspect ratio", () => {
        cy.visitWebchat();
        cy.initMockWebchat({
            settings: {
                dynamicImageAspectRatio: true
            }
        });
        cy.openWebchat();

        cy.withMessageFixture('gallery', () => {
            cy.wait(1000);
            cy.get(".webchat-carousel-template-frame img").then(element => {
                expect(element.innerHeight()).to.equal(element.innerWidth());
            });
        })
    });
})