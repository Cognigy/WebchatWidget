describe('Send Message', () => {

    it('send message button should have correct aria-label', () => {
        cy
			.visitWebchat()
			.initMockWebchat()
			.openWebchat()
			.get('[aria-label="Send Message"]').should('be.visible');
	});

	it('should be possible to type and send message', () => {
        cy
			.visitWebchat()
			.initMockWebchat()
			.openWebchat()
			.get('[aria-label="Message to send"]').type('Hi')
			.get('[aria-label="Send Message"]').click()
			.get('.webchat-chat-history').contains('Hi');
	});
});