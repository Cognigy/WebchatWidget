import { SinonSpy } from "cypress/types/sinon";

describe("disableLocalStorage", () => {
    it("does not try to read from localStorage when disableLocalStorage flag is set", () => {
        cy.visitWebchat();

        cy.window().then(window => {
            cy.spy(window.localStorage, "getItem").as("lsGetItemSpy");
            cy.spy(window.localStorage, "setItem").as("lsSetItemSpy");
        })

        cy.initWebchat({
            settings: {
                disableLocalStorage: true
            }
        });

        cy.openWebchat();

        cy.sendMessage("some message");

        cy.window().contains('You said "some message".').should("be.visible");

        // persisting messages is slightly delayed
        cy.wait(1000);

        cy.get("@lsGetItemSpy").then((spy: any) => {
            expect((spy as SinonSpy).notCalled, "LocalStorage.getItem was never called").to.be.true;
        });

        cy.get("@lsSetItemSpy").then((spy: any) => {
            expect((spy as SinonSpy).notCalled, "LocalStorage.setItem was never called").to.be.true;
        });
    });

    it("does not try to read either from localStorage or sessionStorage when disableLocalStorage and useSessionStorage flags are set", () => {
        cy.visitWebchat();

        cy.window().then(window => {
            cy.spy(window.localStorage, "getItem").as("lsGetItemSpy");
            cy.spy(window.localStorage, "setItem").as("lsSetItemSpy");
            cy.spy(window.sessionStorage, "getItem").as("ssGetItemSpy");
            cy.spy(window.sessionStorage, "setItem").as("ssSetItemSpy");
        })

        cy.initWebchat({
            settings: {
                disableLocalStorage: true,
                useSessionStorage: true
            }
        });

        cy.openWebchat();

        cy.sendMessage("some message");

        cy.window().contains('You said "some message".').should("be.visible");
        
        // persisting messages is slightly delayed
        cy.wait(1000);

        cy.get("@lsGetItemSpy").then((spy: any) => {
            expect((spy as SinonSpy).notCalled, "LocalStorage.getItem was never called").to.be.true;
        });

        cy.get("@lsSetItemSpy").then((spy: any) => {
            expect((spy as SinonSpy).notCalled, "LocalStorage.setItem was never called").to.be.true;
        });

        cy.get("@ssGetItemSpy").then((spy: any) => {
            expect((spy as SinonSpy).notCalled, "SessionStorage.getItem was never called").to.be.true;
        });

        cy.get("@ssSetItemSpy").then((spy: any) => {
            expect((spy as SinonSpy).notCalled, "SessionStorage.setItem was never called").to.be.true;
        });
    });
});