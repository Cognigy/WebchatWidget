describe('Persistent History', () => {
    before(() => {
        cy.window().then(window => {
            window.localStorage.clear();
            window.sessionStorage.clear();
        });
    });

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

        cy.initWebchat(localOptions)
            .openWebchat();
        
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
                useSessionStorage: true
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