describe('Webchat Message Input', () => {

    it('message input filed should have correct aria-label', () => {
        cy
			.visitWebchat()
			.initMockWebchat()
			.openWebchat()
			.get('[aria-label="Message to send"]').should('be.visible');
	});

	it('message input filed should receive focus on open', () => {
        cy
			.visitWebchat()
			.initMockWebchat()
			.openWebchat()
			.get('[aria-label="Message to send"]').should('be.focused');
	});

	it('should be able to type in message input filed should', () => {
        cy
			.visitWebchat()
			.initMockWebchat()
			.openWebchat()
			.get('[aria-label="Message to send"]').type('Hi')
			.get('[aria-label="Message to send"]').should('have.value', 'Hi');
	});

});