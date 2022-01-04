describe("collated text inputs", () => {
    it("shouldn't collate messages by default", () => {
        cy.visitWebchat()
            .initMockWebchat()
            .openWebchat();

        cy.get(".webchat-input-message-input").type("hi").type("{enter}");
        cy.get(".webchat-input-message-input").type("whats up").type("{enter}");
    
        cy.contains("hi").should("be.visible").and("have.text", "hi");
        cy.contains("whats up").should("be.visible").and("have.text", "whats up");
        cy.contains("hi whats up").should("not.exist");
    });

    it("should collate messages if enableInputCollation is enabled", () => {
        cy.visitWebchat()
            .initMockWebchat({
                settings: {
                    enableInputCollation: true
                }
            })
            .openWebchat();

        cy.get(".webchat-input-message-input").type("hi").type("{enter}");
        cy.get(".webchat-input-message-input").type("whats up").type("{enter}");

        cy.contains("hi whats up").should("be.visible");
    });

    it("sends separate messages if the collate timeout of 1000ms was exceeded", () => {
        cy.visitWebchat()
            .initMockWebchat({
                settings: {
                    enableInputCollation: true,
                }
            })
            .openWebchat();

        cy.get(".webchat-input-message-input").type("hi").type("{enter}");
        cy.wait(1100);
        cy.get(".webchat-input-message-input").type("whats up").type("{enter}");
    
        cy.contains("hi").should("be.visible").and("have.text", "hi");
        cy.contains("whats up").should("be.visible").and("have.text", "whats up");
        cy.contains("hi whats up").should("not.exist");
    });

    it("collates a messages if the custom collate timeout of 1500ms was not exceeded", () => {
        cy.visitWebchat()
            .initMockWebchat({
                settings: {
                    enableInputCollation: true,
                    inputCollationTimeout: 1500
                }
            })
            .openWebchat();

        cy.get(".webchat-input-message-input").type("hi").type("{enter}");
        cy.wait(1100);
        cy.get(".webchat-input-message-input").type("whats up").type("{enter}");
    
        cy.contains("hi whats up").should("be.visible");
    });

    it("flushes collated messages when a data-input is sent", () => {
        cy.visitWebchat()
            .initMockWebchat({
                settings: {
                    enableInputCollation: true,
                }
            })
            .openWebchat();

        cy.get(".webchat-input-message-input").type("hi").type("{enter}");
        cy.get(".webchat-input-message-input").type("ho").type("{enter}");
        cy.sendMessage("", { containsData: true });
        cy.get(".webchat-input-message-input").type("whats up").type("{enter}");
    
        cy.contains("hi ho").should("be.visible").and("have.text", "hi ho");
        cy.contains("whats up").should("be.visible").and("have.text", "whats up");
        cy.contains("hi ho whats up").should("not.exist");
    });

    // TODO: make "collate" an opt-in on the "send message" api as an option and only use it on regular text inputs
    it("immediately sends a message triggered by a quick reply");
    it("immediately sends a message triggered by a button template button");
    it("immediately sends a message triggered by a gallery template button");
    it("immediately sends a message triggered by a gallery template default action");
    it("immediately sends a message triggered by a list template item button");
    it("immediately sends a message triggered by a list template item default action");
    it("immediately sends a message triggered by a list template button");
    it("immediately sends a message triggered by a date picker  ");
});