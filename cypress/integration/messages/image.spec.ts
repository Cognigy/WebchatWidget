/// <reference path="../../support/index.d.ts" />

describe("Message with Image", () => {
    beforeEach(() => {
        cy
            .visitWebchat()
            .initMockWebchat()
            .openWebchat()
    })

    it("should render image", () => {
        cy.withMessageFixture('image', () => {
            cy
                .get(".webchat-message-row > div > div").should("have.css", "background-image");
        })
    })

    it("should have class 'webchat-media-template-image'", () => {
        cy.withMessageFixture('image', () => {
            cy
                .get(".webchat-message-row .webchat-media-template-image");
        })
	})
	
	it("should have role 'img' and an aria-label", () => {
        cy.withMessageFixture('image', () => {
            cy
				.get("[role=img]");
			cy
                .get('[aria-label="Attachment Image"]');
        })
    });

    it("should render the image in a fixed aspect ratio", () => {
        cy.withMessageFixture('image', () => {
            cy.get(".webchat-media-template-image > div").then(element => {
                expect(element.innerHeight()).to.equal(element.innerWidth() * 3 / 4);
            });
        })
    });

    it("should render the image in a dynamic aspect ratio", () => {
        cy.visitWebchat();
        cy.initMockWebchat({
            settings: {
                dynamicImageAspectRatio: true
            }
        });
        cy.openWebchat();

        cy.withMessageFixture('image', () => {
            cy.wait(1000);
            cy.get(".webchat-media-template-image > div > img").then(element => {
                expect(element.innerHeight()).to.equal(element.innerWidth());
            });
        })
    });
})