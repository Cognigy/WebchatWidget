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

import 'cypress-wait-until';
import "cypress-real-events/support";
import { IWebchatSettings } from '../../src/common/interfaces/webchat-config';

Cypress.Commands.add('visitWebchat', () => {
    // TODO find a way to silence the logs
    cy.visit('/webchat.test.html', { log: false });

    return cy.then(() => {});
});

Cypress.Commands.add('visitMessageRenderer', () => {
    cy.visit('/message-renderer.test.html');

    return cy.then(() => {});
});

const defaultEndpointResponse = {
    "active": true,
    "URLToken": "fake-url-token",
    "settings": {}
}

Cypress.Commands.add('initMockWebchat', (embeddingOptions = {}, endpointResponse = defaultEndpointResponse) => {
    cy.intercept('GET', 'http://endpoint-mock.cognigy.ai/asdfqwer', endpointResponse);

    return cy.window().then(window => {
        // @ts-ignore
        return window.initWebchat('http://endpoint-mock.cognigy.ai/asdfqwer', embeddingOptions).then(webchat => {
           // @ts-ignore
            window.webchat = webchat;

            return webchat;
        });
    }).as('webchat');
});

Cypress.Commands.add('initWebchat', (embeddingOptions, endpointUrl = 'https://endpoint-trial.cognigy.ai/5e51fcdc2c10fe4c5267c8a798a7134086f60b62998062af620ed73b096e25bd') => {
    return cy.window().then(window => {
        // @ts-ignore
        return window.initWebchat(endpointUrl, embeddingOptions).then((webchat) => {
           // @ts-ignore
           window.webchat = webchat;

           return webchat;
        })
    }).as('webchat');
});

Cypress.Commands.add('getWebchat', () => {
    return cy.get('@webchat');
});

Cypress.Commands.add('openWebchat', () => {
    return cy.getWebchat().then(webchat => {
        webchat.open()
    });
});

Cypress.Commands.add('startConversation', () => {
    return cy.getWebchat().then(webchat => {
        webchat.startConversation()
    });
});

Cypress.Commands.add('submitPrivacyScreen', () => {
    return cy.contains("Submit").click();
});


Cypress.Commands.add('receiveMessage', (text?: string, data?: Object, source: 'bot' | 'agent' = 'bot') => {
    cy.get('@webchat').then(webchat => {
        (webchat as any)._handleOutput({
            id: `fakemessage-${Math.random()}-${Date.now()}`,
            text,
            data,
            source
        });
    });

    return cy.then(() => {});
});

Cypress.Commands.add('sendMessage', (text?: string, data?: Object, source: 'bot' | 'agent' | 'user' = 'user', options = {}) => {
    cy.get('@webchat').then(webchat => {
        (webchat as any).store.dispatch({
            type: 'SEND_MESSAGE',
            message: {
                text,
                data,
                source
            },
            options
        });
    });

    return cy.then(() => {});
})

Cypress.Commands.add('receiveMessageFixture', (filename: string) => {
    cy.fixture(`messages/${filename}.json`).then(message => {
        const { text = null, data = {}, source = 'bot' } = message;

        return cy.receiveMessage(text, data, source);
    });

    return cy.then(() => {});
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

    return cy.then(() => {});
}); 

Cypress.Commands.add('renderMessage', (text: string, data: any, source: string, config: any) => {
    cy.window().then(window => {
        const root = window.document.createElement("div");
        window.document.body.appendChild(root);

        // @ts-ignore
        window.MessageRenderer.renderMessage(
          { text, data, source },
          root,
          config
        );
    });

    return cy.then(() => {});
});

Cypress.Commands.add('setRTLDocument', () => {
    cy.document().then(doc => {
        doc.documentElement.setAttribute('dir', 'rtl');
        cy.wait(500);
    });

    return cy.then(() => { });

});

Cypress.Commands.add('getHistory', () => {
    return cy.getWebchat().then(webchat => {
        // @ts-ignore
        return webchat.store.getState().messages
    });
});

Cypress.Commands.add('getMessageFromHistory', (messageOrMatcher) => {
    return cy.waitUntil(() => {
        return cy.getHistory().then(history => {
            if (typeof messageOrMatcher === 'function') {
                return !!history.find(messageOrMatcher);
            } else {
                const { text, source } = messageOrMatcher; 
                const matchData = messageOrMatcher.data ? JSON.stringify(messageOrMatcher.data) : undefined;
                
                return !!history.find(message => {
                    if (matchData && JSON.stringify(message.data) !== matchData)
                    return false;
                    
                    if (text && message.text !== text)
                    return false;
                    
                    if (source && message.source !== source)
                    return false;
                    
                    return true;
                });
            }
        });
    }, {
        errorMsg: "Message could not be found!"
    });
});

Cypress.Commands.add("loadJavaScriptFixture", (fixture: string) => {
    cy.fixture(fixture, null).then(arraybuffer => {
        const jsString = Buffer.from(arraybuffer).toString('utf-8');
        cy.window().then(window => {
            window.eval(jsString);
        });
    });
});

Cypress.Commands.add('updateSettings', (settings: Partial<IWebchatSettings>) => {
    cy.get('@webchat').then(webchat => {
        (webchat as any).updateSettings(settings);
    });

    return cy.then(() => { });
});

Cypress.Commands.add("focusInput", () => {
	cy.get(".webchat-input-message-input").focus();

	return cy.then(() => {});
});