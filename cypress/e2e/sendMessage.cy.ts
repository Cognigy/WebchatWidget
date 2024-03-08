describe('Send Message', () => {

    it('send message button should have correct aria-label', () => {
        cy
			.visitWebchat()
			.initMockWebchat()
			.openWebchat()
			.startConversation()
			.get('[aria-label="Send Message"]').should('be.visible');
	});

	it('should be possible to type and send message', () => {
        cy
			.visitWebchat()
			.initMockWebchat()
			.openWebchat()
			.startConversation()
			.get('[aria-label="Message to send"]').type('Hi')
			.get('[aria-label="Send Message"]').click()
			.get('.webchat-chat-history').contains('Hi');
	});

	it('should not send messages without text and data', () => {
		cy
			.visitWebchat()
			.initMockWebchat()
			.openWebchat()
			.startConversation();

		cy.wait(1000);

		cy.sendMessage();
		cy.sendMessage("");
		cy.sendMessage("", {});

		cy.getHistory().then(history => {
			expect(history.length).to.equal(0);
		});
	});
});