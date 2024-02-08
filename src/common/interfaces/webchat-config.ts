export type TSourceDirection = 'incoming' | 'outgoing';
export type TSourceColor = 'primary' | 'neutral';

export interface IWebchatConfig {
	active: boolean;
	URLToken: string;
	initialSessionId: string;
	settings: IWebchatSettings;
	isConfigLoaded: boolean;
	isTimedOut: boolean;
}

export interface IBusinessHours {
	startTime: string;
	endTime: string;
	weekDay: string;
}

export interface IWebchatV2Settings {
	awaitEndpointConfig: boolean;
	agentAvatarUrl: string;
	backgroundImageUrl: string;
	businessHours: {
		businessHours: IBusinessHours[];
		enabled: boolean;
		mode: string;
		text: string;
		timeZone: string;
		title: string;
	};
	colorScheme: string;
	connectivity: {
		enabled: boolean;
		mode: string;
		text: string;
		timeout: number;
		title: string;
	}
	designTemplate: number;
	disableBranding: boolean;
	disableDefaultReplyCompatiblityMode: boolean;
	disableHtmlContentSanitization: boolean;
	disableHtmlInput: boolean;
	disableInputAutocomplete: boolean;
	disableInputAutofocus: boolean;
	disableLocalStorage: boolean;
	disablePersistentHistory: boolean;
	disableRenderURLsAsLinks: boolean;
	disableTextInputSanitization: boolean;
	disableToggleButton: boolean;
	disableUrlButtonSanitization: boolean;
	dynamicImageAspectRatio: boolean;
	enableAutoFocus: boolean;
	enableConnectionStatusIndicator: boolean;
	enableFileUpload: boolean;
	enableFocusTrap: boolean;
	enableGenericHTMLStyling: boolean;
	enableInjectionWithoutEmptyHistory: boolean;
	enableInputCollation: boolean;
	enableRating: "always" | "once" | "onRequest";
	enableStrictMessengerSync: boolean;
	enableSTT: boolean;
	enableTTS: boolean;
	enableTypingIndicator: boolean;
	enableUnreadMessageBadge: boolean;
	enableUnreadMessagePreview: boolean;
	enableUnreadMessageSound: boolean;
	enableUnreadMessageTitleIndicator: boolean;
	enableDefaultPreview: boolean;
	enableFileAttachment: boolean;
	fileAttachmentMaxSize: number;
	engagementMessageDelay: number;
	engagementMessageText: string;
	focusInputAfterPostback: boolean;
	getStartedButtonText: string;
	getStartedData: object;
	getStartedPayload: string;
	getStartedText: string;
	headerLogoUrl: string;
	ignoreLineBreaks: boolean;
	inputAutogrowMaxRows: number;
	inputCollationTimeout: number;
	inputPlaceholder: string;
	maintenance: {
		enabled: boolean;
		mode: string;
		text: string;
		title: string;
	};
	/** TODO: this is the botAvatarUrl (rename for major) */
	messageLogoUrl: string;
	ratingCommentText: string;
	ratingMessageHistoryCommentText: string;
	ratingMessageHistoryRatingText: string;
	ratingTitleText: string;
	showEngagementMessagesInChat: boolean;
	startBehavior: "none" | "button" | "injection";
	STTLanguage: string;
	title: string;
	unreadMessageTitleText: string;
	unreadMessageTitleTextPlural: string;
	userAvatarUrl: string;
	useSessionStorage: boolean;
	sourceDirectionMapping: {
		agent: TSourceDirection;
		bot: TSourceDirection;
		engagement: TSourceDirection;
		user: TSourceDirection;
	};
	sourceColorMapping: {
		agent: TSourceColor;
		bot: TSourceColor;
		engagement: TSourceColor;
		user: TSourceColor;
	};
	_endpointTokenUrl: string;
	privacyMessage: string;
	privacyUrl: string;
}

export interface IWebchatSettings {
	// Settings that are also configurable via the Endpoint Editor in Cognigy.AI
	layout: {
		title: string;
		logoUrl: string;
		useOtherAgentLogo: boolean;
		botAvatarName: string;
		botLogoUrl: string;
		agentAvatarName: string;
		agentLogoUrl: string;
		inputAutogrowMaxRows: number;
		enableInputCollation: boolean;
		inputCollationTimeout: number;
		dynamicImageAspectRatio: boolean;
		disableInputAutocomplete: boolean;
		enableGenericHTMLStyling: boolean;
		disableHtmlContentSanitization: boolean;
		disableUrlButtonSanitization: boolean;
		watermark: "default" | "custom" | "none";
		watermarkText: string;
	};
	colors: {
		primaryColor: string;
		secondaryColor: string;
		chatInterfaceColor: string;
		botMessageColor: string;
		userMessageColor: string;
		textLinkColor: string;
	};
	behavior: {
		enableTypingIndicator: boolean;
		messageDelay: number;
		inputPlaceholder: string;
		enableSTT: boolean;
		enableTTS: boolean;
		focusInputAfterPostback: boolean;
		enableConnectionStatusIndicator: boolean;
	};
	startBehavior: {
		startBehavior: "none" | "button" | "injection";
		getStartedPayload: string;
		getStartedData: object;
		getStartedText: string;
		getStartedButtonText: string;
	};
	businessHours: {
		enabled: boolean;
		mode: "inform" | "hide" | "disable";
		text: string;
		title: string;
		timeZone: string;
		times: {
			startTime: string;
			endTime: string;
			weekDay: string;
		}[];
	};
	unreadMessages: {
		enableIndicator: boolean;
		enableBadge: boolean;
		enablePreview: boolean;
		enableSound: boolean;
	};
	homeScreen: {
		enabled: boolean;
		welcomeText: string;
		background: {
			imageUrl: string;
			color: string;
		};
		startConversationButtonText: string;
		previousConversations: {
			enabled: boolean;
			buttonText: string;
			title: string;
		};
	};
	teaserMessage: {
		text: string;
		showInChat: boolean;
	};
	conversationStarters: {
		enabled: boolean;
		starters: {
			type: string;
			title: string;
			url: string;
			postback: string;
		}[];
	};
	chatOptions: {
		enabled: boolean;
		title: string;
		quickReplyOptions: {
			enabled: boolean;
			sectionTitle: string;
			quickReplies: {
				type: string;
				title: string;
				url: string;
				postback: string;
			}[];
		};
		showTTSToggle: boolean;
		activateTTSToggle: boolean;
		labelTTSToggle: string;
		rating: {
			enabled: "no" | "once" | "always";
			title: string;
			commentPlaceholder: string;
			submitButtonText: string;
			eventBannerText: string;
			chatStatusMessage: string;
			messageHistoryRatingText: string;
			messageHistoryCommentText: string;
		};
		footer: {
			enabled: boolean;
			title: string;
			url: string;
		};
	};
	privacyNotice: {
		enabled: boolean;
		title: string;
		text: string;
		submitButtonText: string;
	};
	enableFileAttachment: boolean;
	fileAttachmentMaxSize: number;
	maintenance: {
		enabled: boolean;
		mode: "inform" | "hide" | "disable";
		text: string;
		title: string;
	};
	demoWebchat: {
		enabled: boolean;
		backgroundImageUrl: string;
		position: "centered" | "bottomRight";
	};


	// Settings related to the webchat browser embedding
	// These settings are NOT configurable via the Endpoint Editor in Cognigy.AI
	embeddingConfiguration: {
		_endpointTokenUrl: string;
		awaitEndpointConfig: boolean;
		disableLocalStorage: boolean;
		disablePersistentHistory: boolean;
		useSessionStorage: boolean;
		connectivity: {
			enabled: boolean;
			mode: string;
			text: string;
			timeout: number;
			title: string;
		}
	},

	// Additional Settings to configure the webchat widget behavior
	// These settings are NOT configurable via the Endpoint Editor in Cognigy.AI
	widgetSettings: {
		disableDefaultReplyCompatiblityMode: boolean;
		enableStrictMessengerSync: boolean;

		disableHtmlInput: boolean;
		disableInputAutofocus: boolean;
		disableRenderURLsAsLinks: boolean;
		disableTextInputSanitization: boolean;
		disableToggleButton: boolean;
		enableAutoFocus: boolean;
		enableInjectionWithoutEmptyHistory: boolean;
		enableFocusTrap: boolean;
		enableDefaultPreview: boolean;
		ignoreLineBreaks: boolean;
		STTLanguage: string;
		teaserMessageDelay: number;
		unreadMessageTitleText: string;
		unreadMessageTitleTextPlural: string;
		userAvatarUrl: string;

		sourceDirectionMapping: {
			agent: TSourceDirection;
			bot: TSourceDirection;
			engagement: TSourceDirection;
			user: TSourceDirection;
		};
		sourceColorMapping: {
			agent: TSourceColor;
			bot: TSourceColor;
			engagement: TSourceColor;
			user: TSourceColor;
		};
	};
}