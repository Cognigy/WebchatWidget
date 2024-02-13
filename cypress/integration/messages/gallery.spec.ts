// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../support/index.d.ts" />

describe("Message with Gallery", () => {
    beforeEach(() => {
        cy
            .visitWebchat()
            .initMockWebchat()
            .openWebchat()
            .startConversation()
            .submitPrivacyScreen()
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
            cy.get(".webchat-carousel-template-root > div > div")
                .should("have.css", "background-image")
        })
    })

    it("should render subtitle", () => {
        cy.withMessageFixture('gallery', () => {
            cy.get(".webchat-carousel-template-subtitle")
                .contains(/foobar004g2sub1\sfoobar004g2sub2/)
        })
    })

    it("should have scroll forward button", () => {
        cy.withMessageFixture('gallery', () => {
            cy.get(".gallery-button-next")
        })
    })
    
    it("should scroll on clicking scroll forward button ", () => {
        cy.withMessageFixture('gallery', () => {
            cy.contains("foobar004g3").should("not.be.visible");
            cy.get(".gallery-button-next").click();
            cy.contains("foobar004g3").should("be.visible");
        })
    })
    it("should have scroll backward button", () => {
        cy.withMessageFixture('gallery', () => {
            cy
                .get(".gallery-button-prev").should("not.be.visible")
                .get(".gallery-button-next")
                .click()
                .get(".gallery-button-prev").should("be.visible")
        })
    })

    it("should post in chat on gallery button click", () => {
        cy.withMessageFixture('gallery', () => {
            cy
                .contains("foobar004g1b1")
                .click()
                .get(".webchat-message-row.user").contains("foobar004g1b1")
        })
	})

	it("scroll forward button should have correct aria-label", () => {
        cy.withMessageFixture('gallery', () => {
            cy
				.get('[aria-label="Next slide"]').click()
				.get(".gallery-button-prev").should("be.visible")
        })
	})

	it("scroll backward button should have correct aria-label", () => {
        cy.withMessageFixture('gallery', () => {
            cy
				.get('[aria-label="Next slide"]').click()
				.get('[aria-label="Previous slide"]').click()
				.get(".gallery-button-next").should("be.visible")
        })
	})    
    
    
    it("should render the gallery image in a fixed aspect ratio", () => {
        cy.withMessageFixture('gallery', () => {
            cy.get(".webchat-carousel-template-frame img").then(element => {
                expect(element.innerWidth() / element.innerHeight()).to.equal(206/150);
            });
        })
    });

    // image aspect ratio is always fixed in v3
    xit("should render the gallery image in a dynamic aspect ratio", () => {
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

    it("gallery buttons should have 'aria-label' attribute with button position and name", () => {
        cy.withMessageFixture('gallery', () => {
            cy.wrap([1,2,3,4]).each(number => {
                cy.contains(`foobar004g1b${number}`)
                    .invoke("attr", "aria-label")
                    .should("contain", `Item ${number} of 4: foobar004g1b${number}`);
            })
        })
    })
})