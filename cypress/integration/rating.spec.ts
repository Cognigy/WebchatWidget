describe("Rating", () => {
    beforeEach(() => {
        cy.visitWebchat();
    })

    it("header button shouldn't show up by default", () => {
        cy.initMockWebchat();
        cy.openWebchat();

        cy.contains("Cognigy Webchat").should("be.visible");
        cy.get('[aria-label="Rate your chat"]').should('not.exist');
    });

    it("dialog should show up if requested", () => {
        cy.initMockWebchat();
        cy.openWebchat();

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
        cy.contains("rating text").should("be.visible");
    });

    it("submits a positive rating on request", () => {
        cy.initMockWebchat();
        cy.openWebchat();

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
        cy.get('[aria-label="Send Rating and Comment"]').click();

        cy.getMessageFromHistory({
            data: {
                _cognigy: {
                    controlCommands: [
                        {
                            type: "setRating",
                            parameters: {
                                rating: 1,
                                comment: "I liked it"
                            }
                        }
                    ]
                }
            }
        })
    });

    it("submits a negative rating on request", () => {
        cy.initMockWebchat();
        cy.openWebchat();

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
        cy.get('[aria-label="Send Rating and Comment"]').click();

        cy.getMessageFromHistory({
            data: {
                _cognigy: {
                    controlCommands: [
                        {
                            type: "setRating",
                            parameters: {
                                rating: -1,
                                comment: "I didnt like it"
                            }
                        }
                    ]
                }
            }
        });
    });

    it("shows the rating button in the header if rating is set to always", () => {
        cy.initMockWebchat({
            settings: {
                enableRating: "always"
            }
        });
        cy.openWebchat();

        cy.get("#webchatHeaderOpenRatingDialogButton").should("be.visible");
    });

    it("shows a dialog with default texts when clicking the rating button", () => {
        cy.initMockWebchat({
            settings: {
                enableRating: "always"
            }
        });
        cy.openWebchat();

        cy.get("#webchatHeaderOpenRatingDialogButton").click();

        cy.contains("Please rate your chat experience").should("be.visible");
        cy.contains("Type something here...").should("be.visible");
    });

    it("submits a rating after clicking the rating button", () => {
        cy.initMockWebchat({
            settings: {
                enableRating: "always"
            }
        });
        cy.openWebchat();

        cy.get("#webchatHeaderOpenRatingDialogButton").click();

        cy.get('[aria-label="Thumbs Up"]').click();
        cy.get('[data-test="rating-input"]').type("I loved it");
        cy.get('[aria-label="Send Rating and Comment"]').click();

        cy.getMessageFromHistory({
            data: {
                _cognigy: {
                    controlCommands: [
                        {
                            type: "setRating",
                            parameters: {
                                rating: 1,
                                comment: "I loved it"
                            }
                        }
                    ]
                }
            }
        });
    });

    it("shows the rating button in the header if rating is set to once", () => {
        cy.initMockWebchat({
            settings: {
                enableRating: "once"
            }
        });
        cy.openWebchat();

        cy.get("#webchatHeaderOpenRatingDialogButton").should("be.visible");
    });

    it("can't submit another rating when it was set to once", () => {
        cy.initMockWebchat({
            settings: {
                enableRating: "once"
            }
        });
        cy.openWebchat();

        cy.get("#webchatHeaderOpenRatingDialogButton").click();

        cy.get('[aria-label="Thumbs Up"]').click();
        cy.get('[data-test="rating-input"]').type("I loved it");
        cy.get('[aria-label="Send Rating and Comment"]').click();

        cy.getMessageFromHistory({
            data: {
                _cognigy: {
                    controlCommands: [
                        {
                            type: "setRating",
                            parameters: {
                                rating: 1,
                                comment: "I loved it"
                            }
                        }
                    ]
                }
            }
        });

        cy.get("#webchatHeaderOpenRatingDialogButton").should("not.exist");
    });
})

