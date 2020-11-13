/// <reference path="../../support/index.d.ts" />

import * as moment from "moment"

describe("Date Picker", () => {
    beforeEach(() => {
        cy
            .visitBuild()
            .initMockWebchat()
            .openWebchat()
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
            cy
                .contains("foobar012b1").click();
            cy
                .contains("foobar012b2");
            cy
                .contains("foobar012b3");
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
            cy.get(".regular-message.user").contains(formattedDate);
        })
    })

})