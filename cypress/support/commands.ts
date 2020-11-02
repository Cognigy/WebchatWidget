// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('visitBuild', () => {
    cy.visit('/e2e.html');
});

Cypress.Commands.add('initMockWebchat', (options = {}) => {
    cy.route2('GET', 'http://endpoint-mock.cognigy.ai/asdfqwer', {
        "active": true,
        "URLToken": "fake-url-token",
        "settings": {}
    });

    cy.window().then(window => {
        return window.initWebchat('http://endpoint-mock.cognigy.ai/asdfqwer', options);
    }).as('webchat');   
});

Cypress.Commands.add('getWebchat', () => {
    cy.get('@webchat');
});

Cypress.Commands.add('openWebchat', () => {
    cy.getWebchat().then(webchat => {
        webchat.open()
    });
});

Cypress.Commands.add('receiveMessage', (text?: string, data?: Object, source: 'bot' | 'agent' = 'bot') => {
    cy.get('@webchat').then(webchat => {
        console.log({ webchat });
        webchat.store.dispatch({
            type: 'RECEIVE_MESSAGE',
            message: {
                id: `fakemessage-${Math.random()}-${Date.now()}`,
                text,
                data,
                source
            }
        });
    });
});
