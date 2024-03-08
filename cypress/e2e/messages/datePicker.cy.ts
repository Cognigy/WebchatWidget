// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../support/index.d.ts" />

import * as moment from "moment"

describe("Date Picker", () => {
    beforeEach(() => {
        cy
            .visitWebchat()
            .initMockWebchat()
            .openWebchat()
            .startConversation();
    })

    it("should render plugin open button", () => {
        cy.withMessageFixture('date-picker', () => {
            cy
                .contains("foobar012b1").should("be.visible");
        })
    })

    it("should open 'fullheight' plugin on open button click", () => {
        cy.withMessageFixture('date-picker', () => {
            cy
                .contains("foobar012b1").click().get(".webchat-plugin-date-picker-header").contains(/^foobar012$/);
        })
    })

    it("should render cancel and submit buttons", () => {
        cy.withMessageFixture('date-picker', () => {
            cy.contains("foobar012b1").click();
            // cy.contains("foobar012b2");
            cy.contains("foobar012b3");
        })
    })

    it("should select today and post the date in chat", () => {
        cy.withMessageFixture('date-picker', () => {
            cy
                .contains("foobar012b1").click();
            cy
                .get(".flatpickr-day.today").click();
            cy
                .contains("foobar012b3").click();

            // Our default locale for english is "en-US"
            const formattedDate = moment().format("MM/DD/YYYY");
            cy.get(".webchat-message-row.user").contains(formattedDate);
        })
    })

    it("plugin should have aria attributes necessary for a dialog", () => {
        cy.withMessageFixture('date-picker', () => {
            cy
                .contains("foobar012b1").click()
            cy
                .get(".webchat-plugin-date-picker")
                .should("have.attr", "role", "dialog")
                .should("have.attr", "aria-modal", "true")
                .should("have.attr", "aria-labelledby");
            cy
                .get(".webchat-plugin-date-picker")
                .should("have.attr", "aria-describedby");
        })
    })

    it("calender container element should have tabIndex 0", () => {
        cy.withMessageFixture('date-picker', () => {
            cy
                .contains("foobar012b1").click()
            cy
                .get(".flatpickr-calendar ")
                .should("have.attr", "tabIndex", "0");
        })
    })

    it("calender container element should be auto-focused", () => {
        cy.withMessageFixture('date-picker', () => {
            cy
                .contains("foobar012b1").click()
            cy
                .get(".flatpickr-calendar ")
                .should("be.focused");
        })
    })

    it("should trap focus", () => {
        cy.withMessageFixture('date-picker', () => {
            cy.contains("foobar012b1").click();
            // cy.realPress("Tab")
            //     .contains("foobar012b2").should("be.focused");
            cy.realPress("Tab")
                .contains("foobar012b3").should("be.focused");
            cy.realPress("Tab")
                .get(".flatpickr-calendar ").should("be.focused");
        })
    })

    it("should have class disabled for %2 weekdays", () => {                  
        
        /* When the weekday %2 is true, the date is disabled > "have.class" "flatpickr-disabled" */                
               
        cy.withMessageFixture('date-picker-function', () => {
            cy
                .contains("foobar012b1").click();
            cy
                .contains(".flatpickr-day", "9").should("have.class", "flatpickr-disabled");
            cy
                .contains(".flatpickr-day", "8").should("not.have.class", "flatpickr-disabled");
            cy
                .contains(".flatpickr-day", "10").should("not.have.class", "flatpickr-disabled");
            cy
                .contains(".flatpickr-day", "7").should("have.class", "flatpickr-disabled");
            cy
                .contains(".flatpickr-day", "11").should("have.class", "flatpickr-disabled");
        })
    })

    it("should render the date picker even if the provided function throws a TypeError", () => {                        
        cy.withMessageFixture('date-picker-function-invalid', () => {
            cy
                .contains("foobar012b1").click();
        })
    })
})