describe('Cognigy Branding', () => {
    it('is visible by default', () => {
		cy.visitWebchat().initMockWebchat().openWebchat();
        cy.get('#cognigyBrandingLink').should("be.visible");
    });

    it('is not visible when disabled', () => {
		cy.visitWebchat()
		cy.initMockWebchat({
			settings: {
				disableBranding: true
			}
		})
        cy.get('#cognigyBrandingLink').should("not.exist");
	});
	
	it('is accessible', () => {
		cy.visitWebchat().initMockWebchat().openWebchat();
		cy.get('#cognigyBrandingLink').should("have.attr", "aria-label", "Powered by Cognigy. Opens in new tab")
	})

	it('logo is hidden from screen reader', () => {
		cy.visitWebchat().initMockWebchat().openWebchat();
		cy.get('#cognigyBrandingLogo').should("have.attr", "aria-hidden", "true")
	})
});