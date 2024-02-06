// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../support/index.d.ts" />

describe("Message with Image", () => {
    beforeEach(() => {
        cy
            .visitWebchat()
            .initMockWebchat()
            .openWebchat()
            .startConversation()
            .submitPrivacyScreen()
    })

    it("should render image", () => {
        cy.withMessageFixture('image', () => {
            cy.get(".webchat-message-row > div > img").should("be.visible");
        })
    })

    it("should have class 'webchat-media-template-image'", () => {
        cy.withMessageFixture('image', () => {
            cy.get(".webchat-message-row .webchat-media-template-image");
        })
	})
	
	it("should have alt attibute", () => {
        cy.withMessageFixture('image', () => {
            cy.get(".webchat-message-row > div > img")
                .should('have.attr', 'alt')
                .and("match", /Attachment Image/);
        })
    });

    it("should render the image in a fixed aspect ratio", () => {
        cy.withMessageFixture('image', () => {
            cy.get(".webchat-media-template-image > img").then(element => {
                expect(element.innerWidth() / element.innerHeight()).to.equal(16/9);
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
        cy.startConversation();

        cy.withMessageFixture('image', () => {
            cy.get(".webchat-media-template-image > img").then(element => {
                expect(element.innerHeight()).to.equal(element.innerWidth());
            });
        })
    });
})