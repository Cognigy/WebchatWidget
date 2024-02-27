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
            userId: `user-1`,
            sessionId: `session-1`,
            channel: `channel-1`,
            URLToken: "fake-url-token",
        };

        cy.visitWebchat();

        cy.window().then(window => {
            window.localStorage.clear();
            window.sessionStorage.clear();
        });

        cy.window().then(window => {
            expect(window.localStorage.length).to.equal(0)});

        cy.initWebchat(localOptions).openWebchat().startConversation();
        
        cy.sendMessage('hello');
        
        cy.contains('You said "hello".').should('be.visible');
        cy.reload();

        cy.window().then(window => {
            cy.log(JSON.stringify(window.localStorage));
            expect(window.localStorage.length).to.greaterThan(0);});
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
            window.localStorage.clear();
            window.sessionStorage.clear();
        });

        cy.window().then(window => {
            expect(window.localStorage.length).to.equal(0);
            expect(window.sessionStorage.length).to.equal(0);
        });

        cy.initWebchat(options).openWebchat().startConversation();
        
        cy.sendMessage('hello');
        
        cy.contains('You said "hello".').should('be.visible');
        cy.reload();
        
        cy.window().then(window => {
            cy.log(JSON.stringify(window.localStorage));
            expect(window.sessionStorage.length).to.greaterThan(0);
            expect(window.localStorage.length).to.equal(0);
        });
    });
});