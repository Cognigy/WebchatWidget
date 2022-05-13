/// <reference path="../../support/index.d.ts" />


describe("Date Time Picker", () => {
    beforeEach(() => {
        cy
            .visitWebchat()
            .initMockWebchat()
            .openWebchat()
    })

    it("should trap focus in 24-Hr format", () => {
        cy.withMessageFixture('date-time-picker-24Hr', () => {
            cy
                .contains("foobar012b1").click()
                .get(".flatpickr-calendar ").should("be.focused");
            cy
                .realPress("Tab")
                .get(".flatpickr-hour ").should("be.focused");
            cy
                .realPress("Tab")
                .get(".flatpickr-minute ").should("be.focused");
            cy
                .realPress("Tab")
                .get(".flatpickr-second ").should("be.focused");
            cy
                .realPress("Tab")
                .contains("foobar012b2").should("be.focused");
            cy
                .realPress("Tab")
                .contains("foobar012b3").should("be.focused");
            cy
                .realPress("Tab")
                .get(".flatpickr-calendar ").should("be.focused");
        })
    })

    it("should trap focus in 12-Hr format", () => {
        cy.withMessageFixture('date-time-picker-12Hr', () => {
            cy
                .contains("foobar012b1").click()
                .get(".flatpickr-calendar ").should("be.focused");
            cy
                .realPress("Tab")
                .get(".flatpickr-hour ").should("be.focused");
            cy
                .realPress("Tab")
                .get(".flatpickr-minute ").should("be.focused");
            cy
                .realPress("Tab")
                .get(".flatpickr-second ").should("be.focused");
            cy
                .realPress("Tab")
                .get(".flatpickr-am-pm ").should("be.focused");
            cy
                .realPress("Tab")
                .contains("foobar012b2").should("be.focused");
            cy
                .realPress("Tab")
                .contains("foobar012b3").should("be.focused");
            cy
                .realPress("Tab")
                .get(".flatpickr-calendar ").should("be.focused");
        })
    })
})