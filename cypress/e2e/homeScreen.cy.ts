describe('Home Screen', () => {
    beforeEach(() => {
        cy.visitWebchat();
    });

    it('is not displayed when it is disabled', () => {
        cy.initMockWebchat({
            settings: {
                homeScreen: {
                    enabled: false,
                }
            }
        });
        cy.openWebchat();
        cy.get('h2').contains('Home Screen').should('not.exist');
    });

    it('is displayed when it is enabled', () => {
        cy.initMockWebchat({
            settings: {
                homeScreen: {
                    enabled: true,
                }
            }
        });
        cy.openWebchat();
        cy.get('h2').contains('Home Screen');   
    });

    it('has default logo displayed when not configured', () => {
        cy.initMockWebchat({
            settings: {
                homeScreen: {
                    enabled: true,
                }
            }
        });
        cy.openWebchat();
        cy.get('svg').should('have.attr', 'title', 'Cognigy AI Logo');   
    });

    it('has specified logo displayed when configured', () => {
        cy.initMockWebchat({
            settings: {
                layout: {
                    logoUrl: "https://placewaifu.com/image/300/300",
                },
                homeScreen: {
                    enabled: true,
                }
            }
        });
        cy.openWebchat();
        cy.get('img').should('have.attr', 'src', 'https://placewaifu.com/image/300/300');   
    });

    it('has welcome text displayed when configured', () => {
        cy.initMockWebchat({
            settings: {
                homeScreen: {
                    enabled: true,
                    welcomeText: "Welcome to the home screen",
                }
            }
        });
        cy.openWebchat();
        cy.get('h3').contains('Welcome to the home screen');   
    });

    it('does not have welcome text displayed when not configured', () => {
        cy.initMockWebchat({
            settings: {
                homeScreen: {
                    enabled: true,
                }
            }
        });
        cy.openWebchat();
        cy.get('h3').contains('Welcome to the home screen').should('not.exist');
    });

    it('has default background gradient when image is not configured', () => {
        cy.initMockWebchat({
            settings: {
                homeScreen: {
                    enabled: true,
                    welcomeText: "Welcome to the home screen",
                }
            }
        });
        cy.openWebchat();
        cy.get('.webchat-homescreen-content')
            .should('have.css', 'background-image', 'none, radial-gradient(204.5% 136.79% at 0.53% 95.79%, rgb(237, 236, 249) 0%, rgb(191, 186, 255) 31.77%, rgb(33, 82, 227) 65.63%, rgb(5, 48, 158) 100%)');   
    });

    it('has specified background gradient when configured', () => {
        cy.initMockWebchat({
            settings: {
                homeScreen: {
                    enabled: true,
                    welcomeText: "Welcome to the home screen",
                    background: {
                        color: 'linear-gradient(to right, #ff0000, #0000ff)'
                    }
                }
            }
        });
        cy.openWebchat();
        cy.get('.webchat-homescreen-content').should('have.css', 'background-image', 'none, linear-gradient(to right, rgb(255, 0, 0), rgb(0, 0, 255))');   
    });

    it('has the specified background color when configured', () => {
        cy.initMockWebchat({
            settings: {
                homeScreen: {
                    enabled: true,
                    welcomeText: "Welcome to the home screen",
                    background: {
                        color: 'red',
                    }
                }
            }
        });
        cy.openWebchat();
        cy.get('.webchat-homescreen-content').should('have.css', 'background-color', 'rgb(255, 0, 0)');   
    });

    it('has the specified background image when configured', () => {
        cy.initMockWebchat({
            settings: {
                homeScreen: {
                    enabled: true,
                    welcomeText: "Welcome to the home screen",
                    background: {
                        imageUrl: "https://placewaifu.com/image/300/300",
                    }
                }
            }
        });
        cy.openWebchat().wait(5000);
        cy.get('.webchat-homescreen-content').should('have.css', 'background-image', 'url("https://placewaifu.com/image/300/300"), radial-gradient(204.5% 136.79% at 0.53% 95.79%, rgb(237, 236, 249) 0%, rgb(191, 186, 255) 31.77%, rgb(33, 82, 227) 65.63%, rgb(5, 48, 158) 100%)');   
    });

    it('has the specified start conversation button text when configured', () => {
        cy.initMockWebchat({
            settings: {
                homeScreen: {
                    enabled: true,
                    welcomeText: "Welcome to the home screen",
                    startConversationButtonText: "Start the conversation",
                }
            }
        });
        cy.openWebchat();
        cy.get('button').contains('Start the conversation');   
    });

    it('has the default start conversation button text when not configured', () => {
        cy.initMockWebchat({
            settings: {
                homeScreen: {
                    enabled: true,
                    welcomeText: "Welcome to the home screen",
                }
            }
        });
        cy.openWebchat();
        cy.get('button').contains('Start conversation');   
    });

    it('has the previous conversations button displayed when configured', () => {
        cy.initMockWebchat({
            settings: {
                homeScreen: {
                    enabled: true,
                    welcomeText: "Welcome to the home screen",
                    previousConversations: {
                        enabled: true,
                        buttonText: "View previous conversations",
                    }
                }
            }
        });
        cy.openWebchat();
        cy.get('button').contains('View previous conversations');   
    });

    it('does not have the previous conversations button displayed when not configured', () => {
        cy.initMockWebchat({
            settings: {
                homeScreen: {
                    enabled: true,
                    welcomeText: "Welcome to the home screen",
                }
            }
        });
        cy.openWebchat();
        cy.get('button').contains('View previous conversations').should('not.exist');
    });

    it('has default button text for previous conversation when not configured', () => {
        cy.initMockWebchat({
            settings: {
                homeScreen: {
                    enabled: true,
                    welcomeText: "Welcome to the home screen",
                    previousConversations: {
                        enabled: true,
                    }
                }
            }
        });
        cy.openWebchat();
        cy.get('button').contains('Previous conversations');
    });

    it('has the specified title for previous conversations when configured', () => {
        cy.initMockWebchat({
            settings: {
                homeScreen: {
                    enabled: true,
                    welcomeText: "Welcome to the home screen",
                    previousConversations: {
                        enabled: true,
                        buttonText: "View previous conversations",
                        title: "My Previous conversations",
                    }
                }
            }
        });
        cy.openWebchat();
        cy.get('button').contains('View previous conversations').click();
        cy.get('h2').contains('My Previous conversations');   
    });

    it('has the conversation starters displayed when configured', () => {
        cy.initMockWebchat({
            settings: {
                homeScreen: {
                    enabled: true,
                    welcomeText: "Welcome to the home screen",
                    conversationStarters: {
                        enabled: true,
                        starters: [
                            {
                                type: "postback",
                                title: "Postback starter",
                                payload: "postback-payload",
                            },
                            {
                                type: "web_url",
                                title: "Web URL starter",
                                url: "https://www.google.com",
                            },
                            {
                                type: "phone_number",
                                title: "Phone number starter",
                            },
                        ]
                    }
                }
            }
        });
        cy.openWebchat();
        cy.get('button').contains('Postback starter');
        cy.get('button').contains('Web URL starter');
        cy.get('button').contains('Phone number starter');
    });

    it('has postback buttons that starts a conversation when clicked', () => {
        cy.initMockWebchat({
            settings: {
                homeScreen: {
                    enabled: true,
                    welcomeText: "Welcome to the home screen",
                    conversationStarters: {
                        enabled: true,
                        starters: [
                            {
                                type: "postback",
                                title: "Postback starter",
                                payload: "postback-payload",
                            },
                        ]
                    }
                }
            }
        });
        cy.openWebchat();
        cy.get('button').contains('Postback starter').click();
        cy.get('.webchat-message-row.user .chat-bubble', { timeout: 100 }).contains('Postback starter');
    });

    it('has web url button with correct role when configured', () => {
        cy.initMockWebchat({
            settings: {
                homeScreen: {
                    enabled: true,
                    welcomeText: "Welcome to the home screen",
                    conversationStarters: {
                        enabled: true,
                        starters: [
                            {
                                type: "web_url",
                                title: "Web URL starter",
                                url: "https://www.google.com",
                            },
                        ]
                    }
                }
            }
        });
        cy.openWebchat();
        cy.get('.webchat-homescreen-button').should('have.attr', 'role', 'link');
        cy.get('.webchat-homescreen-button').should('have.attr', 'aria-label', 'Web URL starter. Opens in new tab');
    });

    it('has phone number button with tel link when configured', () => {
        cy.initMockWebchat({
            settings: {
                homeScreen: {
                    enabled: true,
                    welcomeText: "Welcome to the home screen",
                    conversationStarters: {
                        enabled: true,
                        starters: [
                            {
                                type: "phone_number",
                                title: "Phone number starter",
                                payload: "123456789"
                            },
                        ]
                    }
                }
            }
        });
        cy.openWebchat();
        cy.get('a').contains('Phone number starter');
        cy.get('a').should('have.attr', 'href', 'tel:123456789');
    });
   
});