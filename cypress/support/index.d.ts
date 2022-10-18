// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

interface IDummyMessage {
  text: string; 
  data: any; 
  source: 'user' | 'agent' | 'bot';
}

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

      /**
       * Connects to a real endpoint and registers the "webchat" asset
       */
      initWebchat(embeddingOptions?: any, endpointResponse?: any): Chainable<any>;

      getWebchat(): Chainable<any>;

      receiveMessage(text?: string, data?: Object, source?: 'bot' | 'agent' | 'user'): Chainable<ReturnType<cy["window"]>>;
      receiveMessageFixture(filename: string): Chainable<unknown>;

      /**
       * sends a real message as if the user wrote a text and hit the "submit" button
       */
      sendMessage(text?: string, data?: Object, source?: 'bot' | 'agent' | 'user'): Chainable<ReturnType<cy["window"]>>;

      withMessageFixture(withMessageFixture: string, callback: () => void, cleanUpFunc?: () => void): Chainable<any>;

      /**
       * Returns the internal message history
       */
      getHistory(): Chainable<IDummyMessage[]>;

      /**
       * Waits for a message in the webchat history and returns it.
       * This should only be used when needed as it's not checking the UI but rather the internal webchat state
       */
      getMessageFromHistory(messageOrMatcher: (Partial<IDummyMessage> | ((message: IDummyMessage) => boolean))): Chainable<IDummyMessage>;

    
      openWebchat(): Chainable<any>;

      /**
       * renders a message using the message renderer
       */
      renderMessage(text?: string, data?: Object, source?: 'bot' | 'agent' | 'user', config?: any): Chainable<ReturnType<cy["window"]>>;
    
      /** 
       * loads and evaluates a JavaScript fixture file
       */
      loadJavaScriptFixture(name: string): Chainable<unknown>
    }
  }