xdescribe("Generic Message Renderer", () => {
  beforeEach(() => {
    cy.visitMessageRenderer();
  });
  it("is globally registered to window", () => {
    cy.window().then((window) => {
      // @ts-ignore
      expect(window?.MessageRenderer?.renderMessage).to.be.a("function");
    });
  });
  it("renders a text message to a dom node", () => {
    cy.window()
      .then((window) => {
        const root = window.document.createElement("div");
        root.innerText = "before";

        window.document.body.appendChild(root);

        return root;
      })
      .as("root");

    cy.contains("before");

    cy.window().then((window) => {
      cy.get("@root").then((root) => {
        // @ts-ignore
        window.MessageRenderer.renderMessage(
          { text: "hello world", data: {} },
          root.get()[0]
        );
      });
    });

    cy.contains("hello world");
    cy.contains("before").should("not.exist");
  });
});
