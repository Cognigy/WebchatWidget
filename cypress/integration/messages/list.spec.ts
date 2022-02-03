/// <reference path="../../support/index.d.ts" />

describe("Message with List", () => {
    beforeEach(() => {
        cy
            .visitWebchat()
            .initMockWebchat()
            .openWebchat()
    })

    it("should render list", () => {
        cy.withMessageFixture('list', () => {
            cy
                .get(".webchat-message-row").contains("foobar009l1")
                .get(".webchat-message-row").contains("foobar009l2")
        })
	})
	
    it("should render lists subtitle", () => {
        cy.withMessageFixture('list', () => {
            cy
                .get(".webchat-message-row").contains("foobar009ls1")
        })
    })

    it("should render top element of the list large", () => {
        cy.withMessageFixture('list', () => {
            cy
                .get(".webchat-list-template-header > div").should("have.css", "background-image")
        })
    })

    it("should render top element of the list small", () => {
        cy.fixture("messages/list.json").then(list => {
            list.data._cognigy._webchat.message.attachment.payload.top_element_style = "compact";
            cy.receiveMessage(null, list.data);
            cy.get('.webchat-list-template-root').should('be.visible');
            cy.get(".webchat-list-template-header").should("not.exist");
        })
    })

    it("should post in chat on click on postback button", () => {
        cy.withMessageFixture('list', () => {
            cy
                .contains("foobar009l1b1").click().get(".regular-message.user").contains("foobar009l1b1")
        })
    })

    it("should render 'global' button", () => {
        cy.withMessageFixture('list', () => {
            cy
                .contains("foobar009b1");
        })
    })

    it("should have static class names", () => {
        cy.withMessageFixture('list', () => {
            cy
                .get(".webchat-list-template-header")
                .get(".webchat-list-template-root")
                .get(".webchat-list-template-header-content")
                .get(".webchat-list-template-header-content")
                .get(".webchat-list-template-header-content")
                .get(".webchat-list-template-element")
        })
	})
	
	it("should render list and list items with correct roles", () => {
        cy.withMessageFixture('list', () => {
            cy
                .get("[role=list]").should("be.visible")
                .get("[role=list] [role=listitem]").contains("foobar009l2")
        })
    })
    
    it("should render the list header image in a fixed aspect ratio", () => {
        cy.withMessageFixture('list', () => {
            cy.get(".webchat-list-template-header > :first-child").parent().then(element => {
                expect(element.innerHeight()).to.equal(element.innerWidth() / 2);
            });
        })
    });

    it("should render the list header image in a dynamic aspect ratio", () => {
        cy.visitWebchat();
        cy.initMockWebchat({
            settings: {
                dynamicImageAspectRatio: true
            }
        });
        cy.openWebchat();

        cy.withMessageFixture('list', () => {
            cy.get(".webchat-list-template-header img").then(element => {
                expect(element.innerHeight()).to.equal(element.innerWidth());
            });
        })
    });

    
})