describe("Rating", () => {
    beforeEach(() => {
        cy.visitWebchat();
    })

    it("header button shouldn't show up by default", () => {
        cy.initMockWebchat({
            settings: {
                chatOptions: {
                    enabled: true,
                    rating: {
                        enabled: "always",
                    }
                }
            }
        }).openWebchat().startConversation();
        cy.get('[aria-label="Menu"]').as("menuButton");

        cy.get("@menuButton").click();

        cy.contains("Please rate your chat experience").should("be.visible");
        cy.get('[data-test="rating-input"]').should("have.attr", "placeholder", "Type something here...");
    });

    it("dialog should show up if requested", () => {
        cy.initMockWebchat();
        cy.openWebchat().startConversation();

        cy.receiveMessage(
            "", 
            {
                _plugin: {
                  type: "request-rating",
                  data: {
                    ratingTitleText: "rating title",
                    ratingCommentText: "rating text"
                  }
                }
              }, 
            "bot"
        );

        cy.contains("rating title").should("be.visible");
        cy.get('[data-test="rating-input"]').should("have.attr", "placeholder", "rating text");
        
    });

    it("submits a positive rating on request", () => {
        cy.initMockWebchat();
        cy.openWebchat().startConversation();

        cy.receiveMessage(
            "", 
            {
                _plugin: {
                  type: "request-rating",
                  data: {
                    ratingTitleText: "rating title",
                    ratingCommentText: "rating text"
                  }
                }
              }, 
            "bot"
        );

        cy.get('[aria-label="Thumbs Up"]').click();
        cy.get('[data-test="rating-input"]').type("I liked it");            
        cy.get('.webchat-rating-widget-send-button').click();

        cy.get('.webchat-chat-history').contains('Feedback submitted');
    });

    it("submits a negative rating on request", () => {
        cy.initMockWebchat();
        cy.openWebchat().startConversation();

        cy.receiveMessage(
            "", 
            {
                _plugin: {
                  type: "request-rating",
                  data: {
                    ratingTitleText: "rating title",
                    ratingCommentText: "rating text"
                  }
                }
              }, 
            "bot"
        );

        cy.get('[aria-label="Thumbs Down"]').click();
        cy.get('[data-test="rating-input"]').type("I didnt like it");
        cy.get('.webchat-rating-widget-send-button').click();

        cy.get('.webchat-chat-history').contains('Feedback submitted');
    });

    it("shows the rating button in the header if rating is set to always", () => {
        cy.initMockWebchat({
            settings: {
                chatOptions: {
                    enabled: true,
                    rating: {
                        enabled: "always",
                    }
                }
            }
        });
        cy.openWebchat().startConversation();

        cy.get('[aria-label="Menu"]').should("be.visible");
    });

    it("shows a dialog with default texts when clicking the rating button", () => {
        cy.initMockWebchat({
            settings: {
                chatOptions: {
                    enabled: true,
                    rating: {
                        enabled: "always",
                    }
                }
            }
        });
        cy.openWebchat().startConversation();

        cy.get('[aria-label="Menu"]').click();

        cy.contains("Please rate your chat experience").should("be.visible");
        cy.get('[data-test="rating-input"]').should("have.attr", "placeholder", "Type something here...");
    });

    it("submits a rating after clicking the rating button", () => {
        cy.initMockWebchat({
            settings: {
                chatOptions: {
                    enabled: true,
                    rating: {
                        enabled: "always",
                    }
                }
            }
        });
        cy.openWebchat().startConversation();

        cy.get('[aria-label="Menu"]').click();

        cy.get('[aria-label="Thumbs Up"]').click();
        cy.get('[data-test="rating-input"]').type("I loved it");
        cy.get('.webchat-rating-widget-send-button').click();

        cy.get('[aria-live="polite"]').contains('Your feedback was submitted');
    });

    it("shows the rating button in the header if rating is set to once", () => {
        cy.initMockWebchat({
            settings: {
                chatOptions: {
                    enabled: true,
                    rating: {
                        enabled: "once",
                    }
                }
            }
        });
        cy.openWebchat().startConversation();

        cy.get('[aria-label="Menu"]').should("be.visible");
    });

    it("can't submit another rating when it was set to once", () => {
        cy.initMockWebchat({
            settings: {
                chatOptions: {
                    enabled: true,
                    rating: {
                        enabled: "once",
                    }
                }
            }
        });
        cy.openWebchat().startConversation();

        cy.get('[aria-label="Menu"]').click();

        cy.get('[aria-label="Thumbs Up"]').click();
        cy.get('[data-test="rating-input"]').type("I loved it");
        cy.get('.webchat-rating-widget-send-button').click();

        cy.get('[aria-live="polite"]').contains('Your feedback was submitted');

        cy.get('[data-test="rating-input"]').should("not.exist");
    });
})

