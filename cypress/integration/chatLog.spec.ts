describe('Chat Log', () => {
    beforeEach(() => {
        cy.visitWebchat().initMockWebchat().openWebchat();;
    });

    it('is chat log region focusable', () => {
        cy.get('#webchatChatHistoryWrapperLiveLogPanel').should("have.attr", "tabindex", 0);
    });

    it('is chat log region accessible', () => {
        cy.get('#webchatChatHistoryWrapperLiveLogPanel').should("have.attr", "role", "log");
        cy.get('#webchatChatHistoryWrapperLiveLogPanel').should("have.attr", "aria-live", "polite");
    });

    it('chat log region does not contain branding', () => {
        cy.get('#webchatChatHistoryWrapperLiveLogPanel').should("not.contain", "Powered by")
    });

    it('chat log wrapper contains branding', () => {
        cy.get('.webchat-chat-history').get("#cognigyBrandingLink").should("exist");
    });

    it('parent has outline when chat log is focused', () => {
        cy.get('#webchatChatHistoryWrapperLiveLogPanel').focus();
        cy.get('.webchat-chat-history').should("have.attr", "style", "outline: 1px auto black;")
    });
});