describe("Message Plugins", () => {
    beforeEach(() => {
        cy.visitWebchat();
    })

    it("shows message matched by plugin", () => {
        cy.initMockWebchat();
        cy.openWebchat().startConversation();

        cy.receiveMessage(
            "", 
            {
                "_plugin": {
                  "type": "google-maps",
                  "center": {
                      "lat": 51.259823489,
                      "lng": 6.23432432
                  },
                  "zoom": 12,
                  "apikey": ""
                }
              },
            "bot"
        );

        cy.contains("Google").should("be.visible");
    });

    it("skips rendering a messaging not matched by any plugin", () => {
        cy.initMockWebchat();
        cy.openWebchat().startConversation();

        cy.receiveMessage(
            "", 
            {
                "_plugin": {
                  "type": "GARBAGE",
                }
              },
            "bot"
        );

        cy.contains("TEST MESSAGE").should("not.exist");
    });

    it("renders text when exist but no other plugin was matched", () => {
        cy.initMockWebchat();
        cy.openWebchat().startConversation();

        cy.receiveMessage(
            "TEST MESSAGE", 
            {
                "_plugin": {
                  "type": "GARBAGE",
                }
              },
            "bot"
        );

        cy.contains("TEST MESSAGE").should("be.visible");
    });
})

