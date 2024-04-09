import * as moment from "moment";

describe("collated text inputs", () => {
    beforeEach(() => {
        cy.visitWebchat();
    });

    it("shouldn't collate messages by default", () => {
        cy.initMockWebchat()
            .openWebchat()
            .startConversation();
        cy.get(".webchat-input-message-input").type("hi").type("{enter}");
        cy.get(".webchat-input-message-input").type("whats up").type("{enter}");
    
        cy.contains("hi").should("be.visible").and("have.text", "hi");
        cy.contains("whats up").should("be.visible").and("have.text", "whats up");
        cy.contains("hi whats up").should("not.exist");
    });

    it("should collate messages if enableInputCollation is enabled", () => {
        cy.initMockWebchat({
                settings: {
                    layout: {
                        enableInputCollation: true,
                    }
                }
            })
            .openWebchat()
            .startConversation();
        cy.get(".webchat-input-message-input").type("hi").type("{enter}");
        cy.get(".webchat-input-message-input").type("whats up").type("{enter}");

        cy.contains("hi whats up").should("be.visible");
    });

    it("should immediately send messages not using the text input or the 'collate' option", () => {
        cy.initMockWebchat({
                settings: {
                    layout: {
                        enableInputCollation: true,
                    }
                }
            })
            .openWebchat()
            .startConversation();

        cy.sendMessage("immediately there!");
        cy.contains("immediately there!").should("be.visible");
    });

    it("sends separate messages if the collate timeout of 1000ms was exceeded", () => {
        cy.initMockWebchat({
                settings: {
                    layout: {
                        enableInputCollation: true,
                    }
                }
            })
            .openWebchat()
            .startConversation();

        cy.get(".webchat-input-message-input").type("hi").type("{enter}");
        cy.wait(1100);
        cy.get(".webchat-input-message-input").type("whats up").type("{enter}");
    
        cy.contains("hi").should("be.visible").and("have.text", "hi");
        cy.contains("whats up").should("be.visible").and("have.text", "whats up");
        cy.contains("hi whats up").should("not.exist");
    });

    it("collates a messages if the custom collate timeout of 1500ms was not exceeded", () => {
        cy.initMockWebchat({
                settings: {
                    layout: {
                        inputCollationTimeout: 1500,
                        enableInputCollation: true,
                    }
                }
            })
            .openWebchat()
            .startConversation();

        cy.get(".webchat-input-message-input").type("hi").type("{enter}");
        cy.wait(1100);
        cy.get(".webchat-input-message-input").type("whats up").type("{enter}");
    
        cy.contains("hi whats up").should("be.visible");
    });

    it("flushes collated messages when a data-input is sent", () => {
        cy.initMockWebchat({
                settings: {
                    layout: {
                        enableInputCollation: true,
                    }
                }
            })
            .openWebchat()
            .startConversation();

        cy.get(".webchat-input-message-input").type("hi").type("{enter}");
        cy.get(".webchat-input-message-input").type("ho").type("{enter}");
        cy.sendMessage("", { containsData: true });
        cy.get(".webchat-input-message-input").type("whats up").type("{enter}");
    
        cy.contains("hi ho").should("be.visible").and("have.text", "hi ho");
        cy.contains("whats up").should("be.visible").and("have.text", "whats up");
        cy.contains("hi ho whats up").should("not.exist");
    });

    describe("Template Actions", () => {
        beforeEach(() => {
            cy.initMockWebchat({
                settings: {
                    layout: {
                        enableInputCollation: true,
                    }
                }
            })
                .openWebchat()
                .startConversation();
        });

        
        // TODO: make "collate" an opt-in on the "send message" api as an option and only use it on regular text inputs
        it("immediately sends a message triggered by a quick reply", () => {
            cy.withMessageFixture('quick-replies', () => {
                cy.get("button:contains('foobar003qr01')").last().focus();
                cy.get("button:contains('foobar003qr01')").last().click({force: true});
                cy.get(".webchat-message-row.user", { timeout: 100 }).contains("foobar003qr01");
            });
        });
        it("immediately sends a message triggered by a button template button", () => {
            cy.withMessageFixture('buttons', () => {
                cy.contains("foobar005b1").focus();
                cy.contains("foobar005b1").click();
                cy.get(".webchat-message-row.user", { timeout: 100 }).contains("foobar005b1");
            });
        });
        it("immediately sends a message triggered by a gallery template button", () => {
            cy.withMessageFixture('gallery', () => {
                cy.contains("foobar004g1b1").focus();
                cy.contains("foobar004g1b1").click();
                cy.get(".webchat-message-row.user", { timeout: 100 }).contains("foobar004g1b1")
            })
        });
        it("immediately sends a message triggered by a list template button", () => {
            cy.withMessageFixture('list-with-postback', () => {
                cy.contains("foobar00rty1").focus();
                cy.contains("foobar00rty1").click();
                cy.get(".webchat-message-row.user", { timeout: 100 }).contains("foobar00rty1")
            })
        });
        it("immediately sends a message triggered by a list template item button", () => {
            cy.withMessageFixture('list', () => {
                cy.contains("foobar009l1b1").focus();
                cy.contains("foobar009l1b1").click();
                cy.get(".webchat-message-row.user", { timeout: 100 }).contains("foobar009l1b1")
            })
        });
        it("immediately sends a message triggered by a date picker", () => {
            cy.withMessageFixture('date-picker', () => {
                cy.contains("foobar012b1").click();
                cy.get(".flatpickr-day.today").click();
                cy.contains("foobar012b3").click();
                
                // Our default locale for english is "en-US"
                const formattedDate = moment().format("MM/DD/YYYY");
                cy.get(".webchat-message-row.user", { timeout: 500 }).contains(formattedDate);
            })
        });
    });
});