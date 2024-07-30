describe("File Attachement", () => {
	beforeEach(() => {
		cy.visitWebchat();
	});

	it("button should not be visible by default", () => {
		cy.initMockWebchat().openWebchat().startConversation();
		cy.get("#webchatInputMessageAttachFileButton").should("not.exist");
	});

	it("button should be visible when the setting is enabled", () => {
		cy.initMockWebchat({
			settings: {
				fileStorageSettings: {
					enabled: true,
				},
			},
		});
		cy.openWebchat().startConversation();
		cy.get("#webchatInputMessageAttachFileButton").should("be.visible");
	});

	it("button should not be visible when the setting is disabled", () => {
		cy.initMockWebchat({
			settings: {
				fileStorageSettings: {
					enabled: false,
				},
			},
		});
		cy.openWebchat().startConversation();
		cy.get("#webchatInputMessageAttachFileButton").should("not.exist");
	});

	it("upload should fail if file storage provider not configured", () => {
		cy.initMockWebchat({
			settings: {
				fileStorageSettings: {
					enabled: true,
				},
			},
		});
		cy.openWebchat().startConversation();
		cy.get("input[type=file]").selectFile(
			{
				contents: Cypress.Buffer.from("file contents"),
				fileName: "myfile.txt",
				mimeType: "text/plain",
				lastModified: Date.now(),
			},
			{ force: true },
		);
		cy.get("#filePreview0").contains("Upload Failed");
	});

	it.only("upload should succeed if file storage provider configured", () => {
		cy.initMockWebchat({
			settings: {
				fileStorageSettings: {
					enabled: true,
					storageProvider: "azure",
					azureConnection: "asdfqwer",
				},
			},
		});

		cy.openWebchat().startConversation();
		cy.get("input[type=file]").selectFile(
			{
				contents: Cypress.Buffer.from("file contents"),
				fileName: "myfile.txt",
				mimeType: "text/plain",
				lastModified: Date.now(),
			},
			{ force: true },
		);
		cy.get("#filePreview0").contains("myfile.txt");
	});
});
