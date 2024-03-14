describe('Start Behavior', () => {
    it('should automatically send a preconfigured "get started" message', () => {
        cy
            .visitWebchat()
            .initWebchat({
                settings: {
                    startBehavior: {
                        startBehavior: 'injection',
                        getStartedPayload: 'get started',
                        getStartedText: 'get started'
                    }
                }
            })

            cy.get('[data-cognigy-webchat-toggle]').click().startConversation();
            cy.contains('get started').should('be.visible');
    });

    // TODO: This is test is not working as the rexeiveMessage command sends a message only after the getStartedText is sent
    xit('should not send a "get started message" if the history contains messages', () => {
        cy
            .visitWebchat()
            .initWebchat({
                settings: {
                    startBehavior: {
                        startBehavior: 'injection',
                        getStartedPayload: 'get started',
                        getStartedText: 'get started'
                    }
                }
            })

        cy.receiveMessage('fake bot message', {}, 'bot')
        cy.openWebchat().startConversation();
        cy.wait(100)
        cy.contains('get started').should('not.exist');
    });

    it('should not send a "get started message" if the getStartedText is empty', () => {
        cy
            .visitWebchat()
            .initWebchat({
                settings: {
                    startBehavior: {
                        startBehavior: 'injection',
                        getStartedPayload: 'get started',
                        getStartedText: ''
                    }
                }
            });

        cy.get('[data-cognigy-webchat-toggle]').click().startConversation();
        cy.contains('get started').should('not.exist');
    });

    it('should not send a "get started message" if the getStartedText consists only of whitespace', () => {
        cy
            .visitWebchat()
            .initWebchat({
                settings: {
                    startBehavior: {
                        startBehavior: 'injection',
                        getStartedPayload: 'get started',
                        getStartedText: ' '
                    }
                }
            })
            cy.get('[data-cognigy-webchat-toggle]').click().startConversation();
            cy.contains('get started').should('not.exist');
    });

    it('should automatically send a "get started message" even if the history contains an engagement message', () => {
        cy
            .visitWebchat()
            .initWebchat({
                settings: {
                    startBehavior: {
                        startBehavior: 'injection',
                        getStartedPayload: 'get started',
                        getStartedText: 'get started',
                    },
                    teaserMessage: {
                        text: 'engagement message',
						teaserMessageDelay: 200,
                        showInChat: true,
					},
                }
            });
        
        cy.wait(500)
        
        cy.get('[data-cognigy-webchat-toggle]').click().startConversation()
        cy.contains('get started').should('be.visible');
    })

    it('should send a "get started message" with data', () => {
        cy
            .visitWebchat()
            .initWebchat({
                settings: {
                    startBehavior: {
                        startBehavior: "injection",
                        getStartedText: "text",
                        getStartedPayload: "payload",
                        getStartedData: {
                            some: "data"
                        }
                    }
                }
            });

        cy.openWebchat().startConversation();
        cy.getMessageFromHistory({ text: "text", data: { some: "data" } });
    })

    it('should not automatically send a "get started message" without text and data', () => {
        cy
            .visitWebchat()
            .initWebchat({
                settings: {
                    startBehavior: {
                        startBehavior: "injection",
                        getStartedText: "some text",
                        getStartedPayload: "",
                        getStartedData: {}
                    }
                }
            });

        cy.openWebchat().startConversation();
        cy.wait(3000);
        cy.getHistory().then(history => {
            expect(history.find(message => {
                if (message.text)
                    return false;

                if (message.data) {
                    if (typeof message.data === 'object' && Object.keys(message.data).length > 0) {
                        return false
                    }
                }

                return true;
            }), "history doesn't have an empty message").to.be.undefined;
        });
    })

    it('should not display a get-started-button without text and data', () => {
        cy
            .visitWebchat()
            .initWebchat({
                settings: {
                    startBehavior: {
                        startBehavior: "button",
                        getStartedText: "some text",
                        getStartedPayload: "",
                        getStartedData: {}
                    }
                }
            });

        cy.openWebchat();
        cy.get('[data-cognigy-webchat-toggle]').should('not.exist');
    })
});