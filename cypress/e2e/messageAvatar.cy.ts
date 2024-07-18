describe("Webchat Header", () => {
	beforeEach(() => {
		cy.visitWebchat();
	});

    // Webchat header logo tests

	it("should have CognigyAI logo when 'logoUrl' is not configured", () => {
		cy.initMockWebchat().openWebchat().startConversation();

		cy.get(".webchat-header-bar .webchat-header-cognigy-logo").should(
			"have.attr",
			"title",
			"Cognigy AI Logo",
		);
	});

    it("should have custome logo when 'logoUrl' is configured", () => {
        cy.initMockWebchat({
            settings: {
                layout: {
                    logoUrl: "https://placewaifu.com/image/300/300",
                },
            },
        });
        cy.openWebchat().startConversation();

        cy.get(".webchat-header-bar .webchat-header-logo").should("have.attr", "src", "https://placewaifu.com/image/300/300");
    });

    // Webchat header title tests

    it("should have 'Cognigy' as the title by default", () => {
        cy.initMockWebchat().openWebchat().startConversation();

        cy.get("#webchatHeaderTitle").contains("Cognigy");
    });

    it("should have custom title when 'title' is configured", () => {
        cy.initMockWebchat({
            settings: {
                layout: {
                    title: "My Bot Title",
                },
            },
        });
        cy.openWebchat().startConversation();

        cy.get("#webchatHeaderTitle").contains("My Bot Title");
    });
});

describe("Bot message", () => {
	beforeEach(() => {
		cy.visitWebchat();
	});

    // Bot message avatar logo tests

	it("should have Cognigy AI avatar when 'logoUrl' is not configured", () => {
		cy.initMockWebchat().openWebchat().startConversation();
		cy.receiveMessage("bot message", {}, "bot");

		cy.get('[alt="bot avatar"]').should(
			"have.attr",
			"src",
			"data:image/svg+xml,%3csvg%20width='28'%20height='28'%20viewBox='0%200%2028%2028'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='28'%20height='28'%20rx='14'%20fill='%232455E6'/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M11.0839%2010.611L6.96494%2020.4758H4.19922L9.70529%207.29932H12.4626L17.9686%2020.4758H15.2114L11.0839%2010.611ZM22.3168%207.29932V20.4758H19.418V7.29932H22.3168Z'%20fill='white'/%3e%3c/svg%3e",
		);
	});

	it("should have avatar same as the webchat logo when 'logoUrl' is configured", () => {
		cy.initMockWebchat({
			settings: {
				layout: {
					logoUrl: "https://placewaifu.com/image/300/300",
				},
			},
		});
		cy.openWebchat().startConversation();

		cy.receiveMessage("bot message", {}, "bot");

		cy.get('[alt="bot avatar"]').should("have.attr", "src", "https://placewaifu.com/image/300/300");
	});

	it("should have avatar same as the webchat if 'useOtherAgentLogo' is true but 'botLogoUrl' is not configured", () => {
		cy.initMockWebchat({
			settings: {
				layout: {
					logoUrl: "https://placewaifu.com/image/300/300",
					useOtherAgentLogo: true,
				},
			},
		});
		cy.openWebchat().startConversation();
		cy.receiveMessage("bot message", {}, "bot");

		cy.get('[alt="bot avatar"]').should("have.attr", "src", "https://placewaifu.com/image/300/300");
	});

	it("should have custom avatar if 'useOtherAgentLogo' is true and 'botLogoUrl' is configured", () => {
		cy.initMockWebchat({
			settings: {
				layout: {
					logoUrl: "https://placewaifu.com/image/300/300",
					useOtherAgentLogo: true,
					botLogoUrl: "https://www.example.com/bot-logo.png",
				},
			},
		});
		cy.openWebchat().startConversation();
		cy.receiveMessage("bot message", {}, "bot");

		cy.get('[alt="bot avatar"]').should(
			"have.attr",
			"src",
			"https://www.example.com/bot-logo.png",
		);
	});

	it("should not have custom avatar if 'useOtherAgentLogo' is false and 'botLogoUrl' is configured", () => {
		cy.initMockWebchat({
			settings: {
				layout: {
					logoUrl: "https://placewaifu.com/image/300/300",
					useOtherAgentLogo: false,
					botLogoUrl: "https://www.example.com/bot-logo.png",
				},
			},
		});
		cy.openWebchat().startConversation();
		cy.receiveMessage("bot message", {}, "bot");

		cy.get('[alt="bot avatar"]').should("have.attr", "src", "https://placewaifu.com/image/300/300");
	});

    // Bot message avatar name tests

	it("should have avatar name as 'Cognigy' by default", () => {
		cy.initMockWebchat().openWebchat().startConversation();
		cy.receiveMessage("bot message", {}, "bot");

		cy.get(".webchat-message-row.bot span").contains("Bot");
	});

	it("should have avatar name same as the bot title if 'title' is configured", () => {
		cy.initMockWebchat({
			settings: {
				layout: {
					title: "My Bot Title",
				},
			},
		});
		cy.openWebchat().startConversation();
		cy.receiveMessage("bot message", {}, "bot");

		cy.get(".webchat-message-row.bot span").contains("My Bot Title");
	});

	it("should have avatar name same as the bot if 'useOtherAgentLogo' is true but 'botAvatarName' is not configured", () => {
		cy.initMockWebchat({
			settings: {
				layout: {
					title: "My Bot Title",
					useOtherAgentLogo: true,
				},
			},
		});
		cy.openWebchat().startConversation();
		cy.receiveMessage("bot message", {}, "bot");

		cy.get(".webchat-message-row.bot span").contains("My Bot Title");
	});

	it("should have custom avatar name if 'useOtherAgentLogo' is true and 'botAvatarName' is configured", () => {
		cy.initMockWebchat({
			settings: {
				layout: {
					title: "My Bot Title",
					useOtherAgentLogo: true,
					botAvatarName: "My Bot Avatar",
				},
			},
		});
		cy.openWebchat().startConversation();
		cy.receiveMessage("bot message", {}, "bot");

		cy.get(".webchat-message-row.bot span").contains("My Bot Avatar");
	});

	it("should not have custom avatar name if 'useOtherAgentLogo' is false and 'botAvatarName' is configured", () => {
		cy.initMockWebchat({
			settings: {
				layout: {
					title: "My Bot Title",
					useOtherAgentLogo: false,
					botAvatarName: "My Bot Avatar",
				},
			},
		});
		cy.openWebchat().startConversation();
		cy.receiveMessage("bot message", {}, "bot");

		cy.get(".webchat-message-row.bot span").contains("My Bot Title");
	});
});


describe("Human Agent message", () => {
    beforeEach(() => {
        cy.visitWebchat();
    });

    // Agent message avatar logo tests

    it("should have default avatar when agent avatar is not configured", () => {
        cy.initMockWebchat().openWebchat().startConversation();
        cy.receiveMessage("agent message", {}, "agent");

        cy.get('[alt="agent avatar"]').should(
            "have.attr",
            "src",
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAACOklEQVR4Ae3ZA2ydURwF8P9s2+bjPSdGo0aN08V+URtbL+a8BbO9xfZs2zaCuW7vbDx8uLfp/3dinw+XopRSSimllFJhYm9TjV08wwdoYB0f8ix2mDkTe0p7YIZxDeto/5I6rjHDxGtdkcc72n8H75CXruKn1CAcpi0cHE4NEv9kp+EubXHB3ew08QuH4hFt8cGj5Ajxx9hePE1bYi6k+4gvMJ+29GCe+CEzhvW0ZaQ+PVZ8wDW0ZWatuJfozrqyC9Qluotr2Sra8pOtEtewMkgBrBLXsC9QgX3iGm4EKnBDXOP7QAXeiWt4G6jAW3ENNwMVuCmu4UCgAgc6/DCqE1miO9+7X0oEgtVlF1gjPkiOKHs5Pbx9b2jme7SlxPmSC5we20v8kRjJh6Vt6jlU/JKZztsBj1XcH2zxGG3h4ERqkPgp0R35AhvMOuQT3cVnyRH/O9wt4zjLzaj00/F6/dfj9WrPj9eVUkqpRPeMMTnMxxbu4fWf5uP3uME93IZ5JpcxHi4lzGjWYgPPsom2cNDIs9jAWjNaXJvaw1RyES/SlpmLXGQqHb0Rgsv5hjaEvOJyIt6lWg4nacMNTppcHMu9LqYGL2ijCZ6bGuki0TEVuEIbbXDFVEgU2JsbaWPKRvYOf6C8SBtjLoY6yKbH4h5tvMHd5DgJR6Ivb9E6yK1EX6c3AMGDlRIcZtG6i5ktQWGpywJYKkHxgtMC5yUo1tM6TL0ERes2WkALaAEtEEm0gFJKKaWUUkp9ABvn3SEbw3cFAAAAAElFTkSuQmCC",
        );
    });

    it("should have avatar same as the webchat logo when 'logoUrl' is configured", () => {
		cy.initMockWebchat({
			settings: {
				layout: {
					logoUrl: "https://placewaifu.com/image/300/300",
				},
			},
		});
		cy.openWebchat().startConversation();

		cy.receiveMessage("agent message", {}, "agent");

		cy.get('[alt="agent avatar"]').should("have.attr", "src", "https://placewaifu.com/image/300/300");
	});

    it("should have avatar same as the webchat logo if 'useOtherAgentLogo' is true but 'agentLogoUrl' is not configured", () => {
		cy.initMockWebchat({
			settings: {
				layout: {
					logoUrl: "https://placewaifu.com/image/300/300",
					useOtherAgentLogo: true,
				},
			},
		});
		cy.openWebchat().startConversation();
		cy.receiveMessage("agent message", {}, "agent");

		cy.get('[alt="agent avatar"]').should("have.attr", "src", "https://placewaifu.com/image/300/300");
	});

	it("should have custom logo if 'useOtherAgentLogo' is true and 'agentLogoUrl' is configured", () => {
		cy.initMockWebchat({
			settings: {
				layout: {
					logoUrl: "https://placewaifu.com/image/300/300",
					useOtherAgentLogo: true,
					agentLogoUrl: "https://www.example.com/agent-logo.png",
				},
			},
		});
		cy.openWebchat().startConversation();
		cy.receiveMessage("agent message", {}, "agent");

		cy.get('[alt="agent avatar"]').should(
			"have.attr",
			"src",
			"https://www.example.com/agent-logo.png",
		);
	});

	it("should not have custom logo if 'useOtherAgentLogo' is false and 'agentLogoUrl' is configured", () => {
		cy.initMockWebchat({
			settings: {
				layout: {
					logoUrl: "https://placewaifu.com/image/300/300",
					useOtherAgentLogo: false,
					agentLogoUrl: "https://www.example.com/agent-logo.png",
				},
			},
		});
		cy.openWebchat().startConversation();
		cy.receiveMessage("agent message", {}, "agent");

		cy.get('[alt="agent avatar"]').should("have.attr", "src", "https://placewaifu.com/image/300/300");
	});

    // Agent message avatar name tests

    it("should have Agent as the avatar name by default", () => {
        cy.initMockWebchat().openWebchat().startConversation();
        cy.receiveMessage("agent message", {}, "agent");

        cy.get(".webchat-message-row.agent span").contains("Agent");
    });

    it("should have avatar name same as the webchat title if 'title' is configured", () => {
		cy.initMockWebchat({
			settings: {
				layout: {
					title: "My Bot Title",
				},
			},
		});
		cy.openWebchat().startConversation();
		cy.receiveMessage("agent message", {}, "agent");

		cy.get(".webchat-message-row.agent span").contains("My Bot Title");
    });

    it("should have avatar name same as the webchat title if 'useOtherAgentLogo' is true but 'agentAvatarName' is not configured", () => {
        cy.initMockWebchat({
            settings: {
                layout: {
                    title: "My Bot Title",
                    useOtherAgentLogo: true,
                },
            },
        });
        cy.openWebchat().startConversation();
        cy.receiveMessage("agent message", {}, "agent");

        cy.get(".webchat-message-row.agent span").contains("My Bot Title");
    });

    it("should have custom avatar name if 'useOtherAgentLogo' is true and 'agentAvatarName' is configured", () => {
        cy.initMockWebchat({
            settings: {
                layout: {
                    title: "My Bot Title",
                    useOtherAgentLogo: true,
                    agentAvatarName: "My Agent Avatar",
                },
            },
        });
        cy.openWebchat().startConversation();
        cy.receiveMessage("agent message", {}, "agent");

        cy.get(".webchat-message-row.agent span").contains("My Agent Avatar");
    });

    it("should not have custom avatar name if 'useOtherAgentLogo' is false and 'agentAvatarName' is configured", () => {
        cy.initMockWebchat({
            settings: {
                layout: {
                    title: "My Bot Title",
                    useOtherAgentLogo: false,
                    agentAvatarName: "My Agent Avatar",
                },
            },
        });
        cy.openWebchat().startConversation();
        cy.receiveMessage("agent message", {}, "agent");

        cy.get(".webchat-message-row.agent span").contains("My Bot Title");
    });
    
});
