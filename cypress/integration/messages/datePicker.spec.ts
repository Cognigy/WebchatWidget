/// <reference path="../../support/index.d.ts" />

import * as moment from "moment"
import { formatDate, transformNamedDate } from "../../../src/plugins/date-picker/utils"

describe("Date Picker", () => {
    beforeEach(() => {
        cy
            .visitWebchat()
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

    it("should format all dates with Intl the way Moment did", () => {

        const date = new Date();

        const newFormatedDateAu = formatDate(date, false, 'en-AU');
        const newFormatedDateGb = formatDate(date, false, 'en-GB');
        const newFormatedDateCa = formatDate(date, false, 'en-CA');
        const newFormatedDateUs = formatDate(date, false, 'en');

        const oldFormatedDateAu = moment(date).locale('en-AU').format('L');
        const oldFormatedDateGb = moment(date).locale('en-GB').format('L');
        const oldFormatedDateCa = moment(date).locale('en-CA').format('L');
        const oldFormatedDateUs = moment(date).locale('en').format('L');

        const newFormatedDateTimeAu = formatDate(date, true, 'en-AU');
        const newFormatedDateTimeGb = formatDate(date, true, 'en-GB');
        const newFormatedDateTimeCa = formatDate(date, true, 'en-CA');
        const newFormatedDateTimeUs = formatDate(date, true, 'en');

        const oldFormatedDateTimeAu = moment(date).locale('en-AU').format('L LT');
        const oldFormatedDateTimeGb = moment(date).locale('en-GB').format('L LT');
        const oldFormatedDateTimeCa = moment(date).locale('en-CA').format('L LT');
        const oldFormatedDateTimeUs = moment(date).locale('en').format('L LT');

        expect(newFormatedDateAu, "Date format shouldn't change for en-AU").to.be.equal(oldFormatedDateAu);
        expect(newFormatedDateGb, "Date format shouldn't change for en-GB").to.be.equal(oldFormatedDateGb);
        expect(newFormatedDateCa, "Date format shouldn't change for en-CA").to.be.equal(oldFormatedDateCa);
        expect(newFormatedDateUs, "Date format shouldn't change for en").to.be.equal(oldFormatedDateUs);

        expect(newFormatedDateTimeAu, "Date and time format shouldn't change for en-AU").to.be.equal(oldFormatedDateTimeAu);
        expect(newFormatedDateTimeGb, "Date and time format shouldn't change for en-GB").to.be.equal(oldFormatedDateTimeGb);
        expect(newFormatedDateTimeCa, "Date and time format shouldn't change for en-CA").to.be.equal(oldFormatedDateTimeCa);
        expect(newFormatedDateTimeUs, "Date and time format shouldn't change for en").to.be.equal(oldFormatedDateTimeUs);
    })

    it("should display all formatted dates with Intl the way Moment did", () => {

        const date = new Date();

        const transformNamedDateOld = (namedDate: string) => {
            switch (namedDate) {
                case "today":
                    return moment().format('YYYY-MM-DD');

                case "tomorrow":
                    return moment().add(1, 'days').format('YYYY-MM-DD');

                case "yesterday":
                    return moment().add(-1, 'days').format('YYYY-MM-DD');
            }

            return namedDate;
        };

        expect(transformNamedDate(date.toString()), "Current time format shouldn't have changed").to.be.equal(transformNamedDateOld(date.toString()));
        expect(transformNamedDate('today'), "Time format for 'today' shouldn't have changed").to.be.equal(transformNamedDateOld('today'));
        expect(transformNamedDate('tomorrow'), "Time format for 'tomorrow' shouldn't have changed").to.be.equal(transformNamedDateOld('tomorrow'));
        expect(transformNamedDate('yesterday'), "Time format for 'yesterday' shouldn't have changed").to.be.equal(transformNamedDateOld('yesterday'));
    })

})