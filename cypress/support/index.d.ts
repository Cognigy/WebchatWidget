// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
      /**
       * Visits a page that loaded webchat.js
       */
      visitWebchat(): Chainable<Element>;

      /**
       * Visits a page that loaded message-renderer.js
       */
      visitMessageRenderer(): Chainable<Element>;

      /**
       * Connects to a mocked endpoint and registers the "webchat" asset
       */
      initMockWebchat(embeddingOptions?: any, endpointResponse?: any): Chainable<any>;

      getWebchat(): Chainable<any>;

      receiveMessage(text?: string, data?: Object, source?: 'bot' | 'agent' | 'user'): Chainable<ReturnType<cy["window"]>>;
      receiveMessageFixture(filename: string): Chainable<unknown>;

      withMessageFixture(withMessageFixture: string, callback: () => void, cleanUpFunc?: () => void): Chainable<any>;
    
      openWebchat(): Chainable<any>;

      /**
       * renders a message using the message renderer
       */
      renderMessage(text?: string, data?: Object, source?: 'bot' | 'agent' | 'user', config?: any): Chainable<ReturnType<cy["window"]>>;
    }
  }