describe("Generic Message Renderer", () => {
  beforeEach(() => {
    cy.visitBuild();
  });
  it("is globally registered to window", () => {
    cy.window().then((window) => {
      expect(window?.MessageRenderer?.renderMessage).to.be.a("function");
    });
  });
  it("renders a text to a dom node", () => {
    cy.window().then((window) => {
      const root = window.document.createElement("div");
      root.innerText = "before";

      window.document.body.appendChild(root);

      window.MessageRenderer.renderMessage(
        { text: "hello world", data: {} },
        root
      );
    });

    cy.contains("hello world");
  });
});
