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

    it('should not display the engagement message if the webchat was opened', () => {
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
            .wait(500)
            .window()
                .contains('engagement message text', { timeout: 0 })
                .should('not.exist')
    });
});