
interface IGenerateTestCaseParams {
    webchatTabConfigured: boolean;
    facebookTabConfigured: boolean;
    syncWebchatWithFacebookConfigured: boolean;
    enableStrictMessengerSync: boolean;
    expectedOutcome: 'webchat' | 'facebook' | 'none';
}

const renderMessageWithParams = (params: IGenerateTestCaseParams) => {
    cy.visitMessageRenderer();
    
    const config = {
        settings: {
            enableStrictMessengerSync: params.enableStrictMessengerSync
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
            _webchat: params.webchatTabConfigured ? getDummyMessage('RENDER WEBCHAT') : null,
            _facebook: params.facebookTabConfigured ? getDummyMessage("RENDER FACEBOOK") : null,
            syncWebchatWithFacebook: params.syncWebchatWithFacebookConfigured
        }
    };


    cy.renderMessage("", messageData, 'bot', config);
}

const expectOutcomeFromParams = (params: IGenerateTestCaseParams) => {
    switch (params.expectedOutcome) {
        case 'facebook':
            return cy.contains('RENDER FACEBOOK').should('be.visible');

        case 'webchat':
            return cy.contains('RENDER WEBCHAT').should('be.visible');

        case 'none':
            return cy.contains('RENDER').should('not.be.visible');
    }
}

const getTestDescriptionFromParams = (params: IGenerateTestCaseParams) => {
    return `If _webchat: ${params.webchatTabConfigured},
    _facebook: ${params.facebookTabConfigured}, 
    enableStrictMessengerSync: ${params.enableStrictMessengerSync},
    syncWebchatWithFacebookConfigured: ${params.syncWebchatWithFacebookConfigured}
    Should render ${params.expectedOutcome}`; // generated test tescription from params
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

type GenerateTestCaseParamsArray = [boolean, boolean, boolean, boolean, IGenerateTestCaseParams['expectedOutcome']];

const getTestCaseObject = ([webchatTabConfigured, facebookTabConfigured, syncWebchatWithFacebookConfigured, enableStrictMessengerSync, expectedOutcome]: GenerateTestCaseParamsArray): IGenerateTestCaseParams => ({
    webchatTabConfigured,
    facebookTabConfigured,
    syncWebchatWithFacebookConfigured,
    enableStrictMessengerSync,
    expectedOutcome
});

describe("Channel Rendering Priorities", () => {
    describe("Messenger Plugin", () => {
        describe("Without strict Messenger Sync", () => {
            const testcases = [
                // [_webchat, _facebook, syncWebchatWithFacebook, enableStrictMessengerSync, expectedResult]
                [   false,    false,     false,                   false,                     null          ],
                [   true,     false,     false,                   false,                     'webchat'     ],
                [   false,    true,      false,                   false,                     'facebook'    ],
                [   true,     true,      false,                   false,                     'webchat'     ],
            ];
            
            testcases.map(getTestCaseObject).forEach(generateTestCase);
        });

        describe("With strict Messenger Sync", () => {
            const testcases = [
                // [_webchat, _facebook, syncWebchatWithFacebook, enableStrictMessengerSync, expectedResult]
                [   true,     false,     false,                   true,                      'webchat'     ],
                [   false,    true,      false,                   true,                      null          ],
                [   true,     true,      false,                   true,                      'webchat'     ],
                [   false,    false,     false,                   true,                      null          ],
                [   false,    false,     true,                    true,                      null          ],
                [   true,     false,     true,                    true,                      null          ],
                [   false,    true,      true,                    true,                      'facebook'    ],
                [   true,     true,      true,                    true,                      'facebook'    ],
            ];
            
            testcases.map(getTestCaseObject).forEach(generateTestCase);
        });
    });

});



