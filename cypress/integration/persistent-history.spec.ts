describe('Persistent History', () => {
    beforeEach(() => {
        cy.window().then(window => {
            window.localStorage.clear();
            window.sessionStorage.clear();
        });

        // enforce a race condition
        cy.intercept('https://endpoint-trial.cognigy.ai/5e51fcdc2c10fe4c5267c8a798a7134086f60b62998062af620ed73b096e25bd', req => {
            req.continue(res => {
                res.setDelay(1000);
            });
        });
    })

    it('restores a persistent history from LocalStorage', () => {
        const localOptions = {
            userId: `user-${Math.floor(Math.random() * Date.now())}`,
            sessionId: `session-${Math.floor(Math.random() * Date.now())}`,
            channel: `channel-${Math.floor(Math.random() * Date.now())}`
        };

        cy.visitWebchat();


        cy.window().then(window => {
            expect(window.localStorage.getItem(JSON.stringify([localOptions.channel, localOptions.userId, localOptions.sessionId]))).to.be.null;
        });

        cy.initWebchat(localOptions).openWebchat().startConversation();
        
        cy.sendMessage('hello');
        
        cy.contains('You said "hello".').should('be.visible');
        cy.reload();
        
        cy.window().then(window => {
            expect(window.localStorage.getItem(JSON.stringify([localOptions.channel, localOptions.userId, localOptions.sessionId]))).to.not.be.null;
        });
        
        cy.initWebchat(localOptions)
            .openWebchat();
        
        
        cy.contains('You said "hello".').should('be.visible');
    });

    it('restores a persisted history from SessionStorage when using useSessionStorage', () => {
        cy.visitWebchat();

        const options = {
            userId: `user-${Math.floor(Math.random() * Date.now())}`,
            sessionId: `session-${Math.floor(Math.random() * Date.now())}`,
            channel: `channel-${Math.floor(Math.random() * Date.now())}`,
            settings: {
                embeddingConfiguration: {
                    useSessionStorage: true
                }
            }
        };

        cy.window().then(window => {
            expect(window.sessionStorage.getItem(JSON.stringify([options.channel, options.userId, options.sessionId]))).to.be.null;
        });

        cy.initWebchat(options)
            .openWebchat();
        
        cy.sendMessage('hello');
        
        cy.contains('You said "hello".').should('be.visible');
        cy.reload();
        
        cy.window().then(window => {
            expect(window.sessionStorage.getItem(JSON.stringify([options.channel, options.userId, options.sessionId]))).to.not.be.null;
        });
        
        cy.initWebchat(options)
            .openWebchat();
        
        
        cy.contains('You said "hello".').should('be.visible');
    });
});