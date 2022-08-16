
interface IGenerateTestCaseParams {
    defaultPreviewTabConfigured?: boolean;
    webchatTabConfigured?: boolean;
    facebookTabConfigured?: boolean;
    syncWebchatWithFacebookConfigured?: boolean;
    enableStrictMessengerSync: boolean;
    enableDefaultPreview?: boolean;
    expectedOutcome: 'default' | 'webchat' | 'facebook' | 'none' | null;
}

const renderMessageWithParams = (params: IGenerateTestCaseParams) => {
    cy.visitMessageRenderer();

    const config = {
        settings: {
            enableStrictMessengerSync: params.enableStrictMessengerSync,
            enableDefaultPreview: params.enableDefaultPreview
        }
    };

    const getDummyMessage = (text: string) => ({
        message: {
            text,
            quick_replies: []
        }
    });

    const messageData = {
        _cognigy: {
            _defaultPreview: params.defaultPreviewTabConfigured ? getDummyMessage('RENDER DEFAULTPREVIEW') : null,
            _webchat: params.webchatTabConfigured ? getDummyMessage('RENDER WEBCHAT') : null,
            _facebook: params.facebookTabConfigured ? getDummyMessage("RENDER FACEBOOK") : null,
            syncWebchatWithFacebook: params.syncWebchatWithFacebookConfigured
        }
    };


    cy.log(JSON.stringify(messageData));
    cy.log(JSON.stringify(config));

    cy.renderMessage("", messageData, 'bot', config);
}

const expectOutcomeFromParams = (params: IGenerateTestCaseParams) => {
    switch (params.expectedOutcome) {
        case 'facebook':
            return cy.contains('RENDER FACEBOOK').should('be.visible');

        case 'webchat':
            return cy.contains('RENDER WEBCHAT').should('be.visible');

        case 'default':
            return cy.contains('RENDER DEFAULTPREVIEW').should('be.visible');

        case 'none':
        case null:
            return cy.contains('RENDER').should('not.exist');
    }
}

const getTestDescriptionFromParams = (params: IGenerateTestCaseParams) => {
    const expectedResult = (() => {
        if (params.expectedOutcome === 'none' || params.expectedOutcome === null)
            return 'should not render anything';

        return `expecting a "${params.expectedOutcome}" message.`;
    })();

    const messageProperties = (() => {
        const tabNames = [
            params.defaultPreviewTabConfigured && 'default',
            params.webchatTabConfigured && 'webchat',
            params.facebookTabConfigured && 'facebook',
            params.syncWebchatWithFacebookConfigured && 'syncWebchatWithFacebook'
        ].filter(a => !!a);

        return `message has ${tabNames.join(', ')}.`
    })();

    const flags = (() => {
        const flagNames = [
            params.enableStrictMessengerSync && 'enableStrictMessengerSync',
            params.enableDefaultPreview && 'enableDefaultPreview',
        ].filter(a => !!a);

        if (flagNames.length === 0)
            return 'no flags are set.';

        if (flagNames.length === 1)
            return `flag ${flagNames[0]} is set.`;

        return `flags ${flagNames.join(', ')} are set.`;
    })();

    return `${messageProperties} ${flags} ${expectedResult}`;
}

const generateTestCase = (params: IGenerateTestCaseParams) => {
    const description = getTestDescriptionFromParams(params);

    it(description, () => {
        // launch webchat with settings
        renderMessageWithParams(params);

        // expect rendered outcome
        expectOutcomeFromParams(params);
    });
}

describe("Channel Rendering Priorities", {
    defaultCommandTimeout: 500
}, () => {
    describe("Messenger Plugin", () => {
        type GenerateTestCaseParamsArray = [boolean, boolean, boolean, boolean, IGenerateTestCaseParams['expectedOutcome']];

        const getTestCaseObject = ([webchatTabConfigured, facebookTabConfigured, syncWebchatWithFacebookConfigured, enableStrictMessengerSync, expectedOutcome]: GenerateTestCaseParamsArray): IGenerateTestCaseParams => ({
            webchatTabConfigured,
            facebookTabConfigured,
            syncWebchatWithFacebookConfigured,
            enableStrictMessengerSync,
            expectedOutcome
        });

        describe("Without strict Messenger Sync", () => {
            const testcases = [
                // [_webchat, _facebook, syncWebchatWithFacebook, enableStrictMessengerSync, expectedResult]
                [false, false, false, false, null],
                [true, false, false, false, 'webchat'],
                [false, true, false, false, 'facebook'],
                [true, true, false, false, 'webchat'],
            ];

            testcases.map(getTestCaseObject).forEach(generateTestCase);
        });

        describe("With strict Messenger Sync", () => {
            const testcases = [
                // [_webchat, _facebook, syncWebchatWithFacebook, enableStrictMessengerSync, expectedResult]
                [true, false, false, true, 'webchat'],
                [false, true, false, true, null],
                [true, true, false, true, 'webchat'],
                [false, false, false, true, null],
                [false, false, true, true, null],
                [true, false, true, true, null],
                [false, true, true, true, 'facebook'],
                [true, true, true, true, 'facebook'],
            ];

            testcases.map(getTestCaseObject).forEach(generateTestCase);
        });
    });

    describe("Default Previews", () => {
        describe('_defaultPreview is always preferred over _webchat and _facebook if enableDefaultPreview is set', () => {
            // _defaultPreview, _webchat, _facebook, enableDefaultPreview, expectedResult
            const cases = [
                [0, 0, 0, 0, 'none'],
                [1, 0, 0, 0, 'none'],
                [0, 1, 0, 0, 'webchat'],
                [1, 1, 0, 0, 'webchat'],
                [0, 0, 1, 0, 'facebook'],
                [1, 0, 1, 0, 'facebook'],
                [0, 1, 1, 0, 'webchat'],
                [1, 1, 1, 0, 'webchat'],
                [0, 0, 0, 1, 'none'],
                [1, 0, 0, 1, 'default'],
                [0, 1, 0, 1, 'webchat'],
                [1, 1, 0, 1, 'default'],
                [0, 0, 1, 1, 'facebook'],
                [1, 0, 1, 1, 'default'],
                [0, 1, 1, 1, 'webchat'],
                [1, 1, 1, 1, 'default'],
            ];

            cases
                .map(([
                    _defaultPreview,
                    _webchat,
                    _facebook,
                    enableDefaultPreview,
                    expectedOutcome
                ]): IGenerateTestCaseParams => ({
                    enableStrictMessengerSync: false,
                    expectedOutcome: expectedOutcome as any,
                    defaultPreviewTabConfigured: !!_defaultPreview,
                    facebookTabConfigured: !!_facebook,
                    webchatTabConfigured: !!_webchat,
                    enableDefaultPreview: !!enableDefaultPreview,
                    syncWebchatWithFacebookConfigured: false
                }))
                .forEach(generateTestCase);
        });


        describe('_defaultPreview is preferred for all builtin message plugins if enableDefaultPreview is set', () => {
            it('should prefer a text from the default tab over quick replies from the webchat tab', () => {
                cy.visitMessageRenderer();

                cy.renderMessage("DEFAULT TEXT", {
                    _cognigy: {
                        _webchat: {
                            message: {
                                text: "WEBCHAT QUICK REPLIES"
                            }
                        }
                    }
                }, "bot", {
                    settings: {
                        enableDefaultPreview: true
                    }
                });

                cy.contains("DEFAULT TEXT").should('be.visible');
            });

            it('should prefer quick replies from the default tab over quick replies from the webchat tab', () => {
                cy.visitMessageRenderer();

                cy.renderMessage("", {
                    _cognigy: {
                        _defaultPreview: {
                            message: {
                                text: "DEFAULT QUICK REPLIES"
                            }
                        },
                        _webchat: {
                            message: {
                                text: "WEBCHAT QUICK REPLIES"
                            }
                        },
                    }
                }, "bot", {
                    settings: {
                        enableDefaultPreview: true
                    }
                });

                cy.contains("DEFAULT QUICK REPLIES").should('be.visible');
            });

            it('should prefer adaptivecards from the default tab over quick replies from the webchat tab', () => {
                cy.visitMessageRenderer();

                cy.renderMessage("", {
                    _cognigy: {
                        _defaultPreview: {
                            adaptiveCard: {
                                type: "AdaptiveCard",
                                $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
                                version: "1.5",
                                body: [
                                    {
                                        type: "TextBlock",
                                        text: "DEFAULT ADAPTIVECARDS",
                                        wrap: true
                                    }
                                ]
                            }
                        },
                        _webchat: {
                            message: {
                                text: "WEBCHAT QUICK REPLIES"
                            }
                        }
                    }
                }, "bot", {
                    settings: {
                        enableDefaultPreview: true
                    }
                });

                cy.contains("DEFAULT ADAPTIVECARDS").should('be.visible');
            });

            it('should prefer quick replies from the webchat tab over adaptivecards from the default tab', () => {
                cy.visitMessageRenderer();

                cy.renderMessage("", {
                    _cognigy: {
                        _defaultPreview: {
                            adaptiveCard: {
                                type: "AdaptiveCard",
                                $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
                                version: "1.5",
                                body: [
                                    {
                                        type: "TextBlock",
                                        text: "DEFAULT ADAPTIVECARDS",
                                        wrap: true
                                    }
                                ]
                            }
                        },
                        _webchat: {
                            message: {
                                text: "WEBCHAT QUICK REPLIES"
                            }
                        }
                    }
                }, "bot", {
                    settings: {
                        enableDefaultPreview: false
                    }
                });

                cy.contains("WEBCHAT QUICK REPLIES").should('be.visible');
            });

            it('should prefer quick replies from the webchat tab over text from the default tab', () => {
                cy.visitMessageRenderer();

                cy.renderMessage("DEFAULT TEXT", {
                    _cognigy: {
                        _webchat: {
                            message: {
                                text: "WEBCHAT QUICK REPLIES"
                            }
                        },
                    }
                }, "bot", {
                    settings: {
                        enableDefaultPreview: false
                    }
                });

                cy.contains("WEBCHAT QUICK REPLIES").should('be.visible');
            });

            it('should prefer adaptivecard from the webchat tab over adaptivecard from the default tab', () => {
                cy.visitMessageRenderer();

                cy.renderMessage("", {
                    _cognigy: {
                        _webchat: {
                            adaptiveCard: {
                                type: "AdaptiveCard",
                                $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
                                version: "1.5",
                                body: [
                                    {
                                        type: "TextBlock",
                                        text: "WEBCHAT ADAPTIVE CARD",
                                        wrap: true
                                    }
                                ]
                            }
                        },
                        _defaultPreview: {
                            adaptiveCard: {
                                type: "AdaptiveCard",
                                $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
                                version: "1.5",
                                body: [
                                    {
                                        type: "TextBlock",
                                        text: "DEFAULT ADAPTIVE CARD",
                                        wrap: true
                                    }
                                ]
                            }
                        }
                    }
                }, "bot", {
                    settings: {
                        enableDefaultPreview: false
                    }
                });

                cy.contains("WEBCHAT ADAPTIVE CARD").should('be.visible');
            });

            it('should prefer default quick replies tab over webchat adaptive card', () => {
                cy.visitMessageRenderer();

                cy.renderMessage("", {
                    _cognigy: {
                        _webchat: {
                            adaptiveCard: {
                                type: "AdaptiveCard",
                                $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
                                version: "1.5",
                                body: [
                                    {
                                        type: "TextBlock",
                                        text: "WEBCHAT ADAPTIVE CARD",
                                        wrap: true
                                    }
                                ]
                            }
                        },
                        _defaultPreview: {
                            message: {
                                text: "DEFAULT QUICK REPLIES"
                            }
                        },
                    }
                }, "bot", {
                    settings: {
                        enableDefaultPreview: true
                    }
                });

                cy.contains("DEFAULT QUICK REPLIES").should('be.visible');
            });

            it('should prefer webchat adaptive card over default Quick reply', () => {
                cy.visitMessageRenderer();

                cy.renderMessage("", {
                    _cognigy: {
                        _webchat: {
                            adaptiveCard: {
                                type: "AdaptiveCard",
                                $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
                                version: "1.5",
                                body: [
                                    {
                                        type: "TextBlock",
                                        text: "WEBCHAT ADAPTIVE CARD",
                                        wrap: true
                                    }
                                ]
                            }
                        },
                        _defaultPreview: {
                            message: {
                                text: "DEFAULT QUICK REPLIES"
                            }
                        },
                    }
                }, "bot", {
                    settings: {
                        enableDefaultPreview: false
                    }
                });

                cy.contains("WEBCHAT ADAPTIVE CARD").should('be.visible');
            });

            it('should prefer webchat quick replies over default quick replies', () => {
                cy.visitMessageRenderer();

                cy.renderMessage("", {
                    _cognigy: {
                        _webchat: {
                            message: {
                                text: "WEBCHAT QUICK REPLIES"
                            }
                        },
                        _defaultPreview: {
                            message: {
                                text: "DEFAULT QUICK REPLIES"
                            }
                        },
                    }
                }, "bot", {
                    settings: {
                        enableDefaultPreview: false
                    }
                });

                cy.contains("WEBCHAT QUICK REPLIES").should('be.visible');
            });

            it('should prefer text from the default tab over adaptivecards from the webchat tab', () => {
                cy.visitMessageRenderer();

                cy.renderMessage("DEFAULT TEXT", {
                    _cognigy: {
                        _webchat: {
                            adaptiveCard: {
                                type: "AdaptiveCard",
                                $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
                                version: "1.5",
                                body: [
                                    {
                                        type: "TextBlock",
                                        text: "DEFAULT TEXT",
                                        wrap: true
                                    }
                                ]
                            }
                        }
                    }
                }, "bot", {
                    settings: {
                        enableDefaultPreview: true
                    }
                });

            });

            it('should prefer adaptive cards from the webchat tab over text from the default tab ', () => {
                cy.visitMessageRenderer();

                cy.renderMessage("DEFAULT TEXT", {
                    _cognigy: {
                        _webchat: {
                            adaptiveCard: {
                                type: "AdaptiveCard",
                                $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
                                version: "1.5",
                                body: [
                                    {
                                        type: "TextBlock",
                                        text: "DEFAULT TEXT ADAPTIVE CARD",
                                        wrap: true
                                    }
                                ]
                            }
                        }
                    }
                }, "bot", {
                    settings: {
                        enableDefaultPreview: false
                    }
                });

                cy.contains("DEFAULT TEXT ADAPTIVE CARD").should('be.visible');
            });

            it('should prefer adaptive cards from the default tab over adaptivecard from the webchat tab ', () => {
                cy.visitMessageRenderer();

                cy.renderMessage("", {
                    _cognigy: {
                        _webchat: {
                            adaptiveCard: {
                                type: "AdaptiveCard",
                                $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
                                version: "1.5",
                                body: [
                                    {
                                        type: "TextBlock",
                                        text: "WEBCHAT TEXT ADAPTIVE CARD",
                                        wrap: true
                                    }
                                ]
                            }
                        },
                        _defaultPreview: {
                            adaptiveCard: {
                                type: "AdaptiveCard",
                                $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
                                version: "1.5",
                                body: [
                                    {
                                        type: "TextBlock",
                                        text: "DEFAULT TEXT ADAPTIVE CARD",
                                        wrap: true
                                    }
                                ]
                            }
                        }
                    }
                }, "bot", {
                    settings: {
                        enableDefaultPreview: true
                    }
                });

                cy.contains("DEFAULT TEXT ADAPTIVE CARD").should('be.visible');
            });
        });

    });
});



