describe('Webchat Button', () => {

    it('should have correct aria-label for open webchat button', () => {
        cy
			.visitWebchat()
			.initMockWebchat()
            .get('[aria-label="Open chat"]').click()
			.get('[aria-label="Open chat"]').should('not.exist');
	});

	it('should have correct aria-label for open webchat button with one unread message', () => {
        cy
			.visitWebchat()
			.initMockWebchat({
                settings: {
                    enableUnreadMessagePreview: true,
                    engagementMessageText: 'engagement message text'
                }
			})
			.wait(6000)
            .get('[aria-label="One unread message in chat. Open chat"]').should('be.visible')
			.get('[aria-label="One unread message in chat. Open chat"]').click()
			.get('[aria-label="One unread message in chat. Open chat"]').should('not.exist');
	});
	
	it('should have correct aria-label for open webchat button with one unread message', () => {
        cy
			.visitWebchat()
			.initMockWebchat({
                settings: {
                    enableUnreadMessagePreview: true,
                }
			})			
			.withMessageFixture('text', ()=>{ 
				cy.withMessageFixture('audio', ()=>{
					cy.get('[aria-label="2 unread messages in chat. Open chat"]').should('be.visible');
				});				
			});            
    });
	
	it('should have correct aria-label for close webchat button', () => {
        cy
			.visitWebchat()
			.initMockWebchat()
            .get('[aria-label="Open chat"]').click()
			.get('[aria-label="Close chat"]').should('be.visible')
			.get('[aria-label="Close chat"]').click()
			.get('[aria-label="Close chat"]').should('not.exist');
	});
	
	it('should have correct aria-label for close button in chat window', () => {
        cy
			.visitWebchat()
			.initMockWebchat()
            .get('[aria-label="Open chat"]').click()
			.get('[aria-label="Close Chat"]').click()
			.get('[aria-label="Close Chat"]').should('not.exist');
	});

});