/// <reference path="../support/index.d.ts" />

describe('the test webchat', () => {
    it('should fake an incoming message', () => {
        cy
            .visitBuild()
            .initMockWebchat()
            .openWebchat()
            .receiveMessage('hello world!')
            .get('[data-cognigy-webchat]')
            .contains('hello world!').should('exist');
    });
})