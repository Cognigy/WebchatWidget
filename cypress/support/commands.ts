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
    cy.visit('/');
});

const defaultEndpointResponse = {
    "active": true,
    "URLToken": "fake-url-token",
    "settings": {}
}

Cypress.Commands.add('initMockWebchat', (embeddingOptions = {}, endpointResponse = defaultEndpointResponse) => {
    cy.route2('GET', 'http://endpoint-mock.cognigy.ai/asdfqwer', endpointResponse);

    cy.window().then(window => {
        return window.initWebchat('http://endpoint-mock.cognigy.ai/asdfqwer', embeddingOptions);
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
        (webchat as any).store.dispatch({
            type: 'RECEIVE_MESSAGE',
            message: {
                id: `fakemessage-${Math.random()}-${Date.now()}`,
                text,
                data,
                source
            }
        });
        return cy.window()
    });
});

/**
 * Loads message(s) from '/fixtures/messages/' folder into the chat history 
 * and calls the provided callback function afterwards. If the file contains 
 * an array of messages, call the function for every messages.
 *
 * 
 * Use cases for an "array of messages" fixture format:
 * - endpoint can change the message format overtime - we run the same test case 
 * with an old and a new message format to ensure we keep the backwards compatibility. 
 * 
 * - run the same tests against the messages containing minor difference:
 * e.g. a misconfigured/empty parameter in Quick Replies template should not break the ui,
 * and/or rendering the rest of the message, and/or passing the same test.
 * 
 * See an example of usage in quickReplies.spec.ts
 */
Cypress.Commands.add('withMessageFixture', (filename: string, callbackFunc: () => void, cleanUpFunc: () => void) => {
    cy.fixture(`messages/${filename}.json`).then(json => {
        if (Array.isArray(json)) {
            json.forEach((message, index) => {
                cy.log(`Fixture ${filename} #${index+1} of ${json.length}`);
                cy.receiveMessage(message?.text ?? null, message?.data ?? {}, 'bot').then(callbackFunc);
                if (typeof cleanUpFunc === "function" && index < json.length - 1) cy.then(cleanUpFunc);
            });
        } else {
            cy.receiveMessage(json?.text ?? null, json?.data ?? {}, 'bot').then(callbackFunc);
        }
    });
}); 
