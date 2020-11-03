/// <reference path="../support/index.d.ts" />

describe('Engagement Message', () => {
    it('should display an engagement message if engagementMessageText is configured', () => {
        cy
            .visitBuild()
            .initMockWebchat({
                settings: {
                    enableUnreadMessagePreview: true,
                    engagementMessageText: 'engagement message text'
                }
            })
            .window()
            .contains('engagement message text', { timeout: 6000 })
            .should('be.visible')
    });

    it('should show an engagement message with a custom delay if engagementMessageDelay is configured', () => {
        cy
            .visitBuild()
            .initMockWebchat({
                settings: {
                    enableUnreadMessagePreview: true,
                    engagementMessageDelay: 1,
                    engagementMessageText: 'engagement message text'
                }
            })
            .window()
            .contains('engagement message text', { timeout: 500 })
            .should('be.visible')
    });

    it('should not show an engagement message if engagementMessageText is not configured', () => {
        cy
            .visitBuild()
            .initMockWebchat({
                settings: {
                    enableUnreadMessagePreview: true,
                    engagementMessageDelay: 1
                }
            })
            .wait(500)
            .window()
            .contains('engagement message text', { timeout: 500 })
            .should('not.be.visible')
    });

    it('should not trigger the engagement message if the webchat is open', () => {
        cy
            .visitBuild()
            .initMockWebchat({
                settings: {
                    enableUnreadMessagePreview: true,
                    engagementMessageText: 'engagement message text',
                    engagementMessageDelay: 1
                }
            })
            .openWebchat()
            .wait(500)
            .window()
            .contains('engagement message text', { timeout: 0 })
            .should('not.exist')
    });

    it('should not trigger the engagement message if the webchat has been open before', () => {
        cy
            .visitBuild()
            .initMockWebchat({
                settings: {
                    enableUnreadMessagePreview: true,
                    engagementMessageText: 'engagement message text',
                    engagementMessageDelay: 1
                }
            })
            .get('[data-cognigy-webchat-toggle]')
            .click()
            .click()
            .wait(500)
            .window()
            .contains('engagement message text', { timeout: 0 })
            .should('not.exist')
    });

    it('should not display an engagement message if the endpoint is disabled', () => {
        cy
            .visitBuild()
            .initMockWebchat({
                settings: {
                    enableUnreadMessagePreview: true,
                    engagementMessageText: 'engagement message text',
                    engagementMessageDelay: 1
                }
            },
                {
                    "active": false,
                    "URLToken": "fake-url-token",
                    "settings": {}
                })
            .wait(500)
            .window()
            .contains('engagement message text', { timeout: 0 })
            .should('not.exist')
    });

    it('should not display an engagement message if the history is not empty', () => {
        cy
            .visitBuild()
            .initMockWebchat({
                settings: {
                    enableUnreadMessagePreview: true,
                    engagementMessageText: 'engagement message text',
                    engagementMessageDelay: 1
                }
            })
            .receiveMessage('hello there')
            .wait(500);

        cy
            .contains('engagement message text', { timeout: 0 }).should('not.exist')
    });

    it('should not show the engagement message in the history', () => {
        cy
            .visitBuild()
            .initMockWebchat({
                settings: {
                    enableUnreadMessagePreview: true,
                    engagementMessageText: 'engagement message text',
                    engagementMessageDelay: 1
                }
            })
            .wait(500);

        cy
            .contains('engagement message text').should('be.visible');

        cy
            .get('[data-cognigy-webchat-toggle]').click()
            .wait(100)

        cy
            .contains('engagement message text').should('not.exist');
    });

    it('should display the engagement message in the history if enableEngagementMessageInHistory is true', () => {

        cy
            .visitBuild()
            .initMockWebchat({
                settings: {
                    enableUnreadMessagePreview: true,
                    engagementMessageText: 'engagement message text',
                    engagementMessageDelay: 1,
                    enableEngagementMessageInHistory: true
                }
            })
            .wait(500);

        cy
            .contains('engagement message text').should('be.visible');

        cy
            .get('[data-cognigy-webchat-toggle]').click()
            .wait(100)

        cy
            .contains('engagement message text').should('be.visible');
    })
});