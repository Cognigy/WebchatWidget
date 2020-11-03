import { injectGlobal } from "emotion";

describe('Start Behavior', () => {
    it('should automatically send a preconfigured "get started" message', () => {
        cy
            .visitBuild()
            .initMockWebchat({
                settings: {
                    startBehavior: 'injection',
                    getStartedPayload: 'get started',
                    getStartedText: 'get started'
                }
            })
            .get('[data-cognigy-webchat-toggle]').click()
            .window().contains('get started').should('be.visible');
    });

    it('should not send a "get started message" if the history contains messages', () => {
        cy
            .visitBuild()
            .initMockWebchat({
                settings: {
                    startBehavior: 'injection',
                    getStartedPayload: 'get started',
                    getStartedText: 'get started'
                }
            })
            .receiveMessage('fake bot message')
            .get('[data-cognigy-webchat-toggle]').click()
            .wait(100)
            .window().contains('get started').should('not.exist');
    });

    it('should automatically send a "get started message" even if the history contains only "engagement messages"', () => {
        cy
            .visitBuild()
            .initMockWebchat({
                settings: {
                    startBehavior: 'injection',
                    getStartedPayload: 'get started',
                    getStartedText: 'get started',
                    engagementMessageText: 'engagement message',
                    engagementMessageDelay: 1
                }
            })
            .wait(500)
            .get('[data-cognigy-webchat-toggle]').click()
            .window().contains('engagement message').should('be.visible')
            .window().contains('get started').should('be.visible');
    })
});