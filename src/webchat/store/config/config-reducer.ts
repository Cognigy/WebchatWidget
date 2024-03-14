import { Reducer } from "redux";
import {
	IWebchatConfig,
	IWebchatSettings,
} from "../../../common/interfaces/webchat-config";
import { merge } from 'lodash';

export type ConfigState = IWebchatConfig;

export const getInitialState = (): ConfigState => ({
	URLToken: "",
	initialSessionId: "",
	active: false,
	isConfigLoaded: false,
	isTimedOut: false,

	settings: {
		layout: {
			title: "",
			logoUrl: "",
			useOtherAgentLogo: false,
			botAvatarName: "",
			botLogoUrl: "",
			agentAvatarName: "",
			agentLogoUrl: "",
			inputAutogrowMaxRows: 4,
			enableInputCollation: false,
			inputCollationTimeout: 1000,
			dynamicImageAspectRatio: false,
			disableInputAutocomplete: false,
			enableGenericHTMLStyling: false,
			disableHtmlContentSanitization: false,
			disableUrlButtonSanitization: false,
			watermark: "default",
			watermarkText: "Powered by Cognigy.AI",
		},
		colors: {
			primaryColor: "",
			secondaryColor: "",
			chatInterfaceColor: "",
			botMessageColor: "",
			userMessageColor: "",
			textLinkColor: "",
		},
		behavior: {
			enableTypingIndicator: true,
			messageDelay: 500,
			inputPlaceholder: "Type something here…",
			enableSTT: false,
			enableTTS: false,
			focusInputAfterPostback: false,
			enableConnectionStatusIndicator: true,
		},
		startBehavior: {
			startBehavior: "none",
			getStartedButtonText: "",
			getStartedData: {},
			getStartedPayload: "",
			getStartedText: "",
		},
		fileStorageSettings: {
			enabled: false,
			dropzoneText: "",
		},
		businessHours: {
			times: [],
			enabled: false,
			mode: "inform",
			text: "",
			timeZone: "Europe/Berlin",
			title: "",
		},
		unreadMessages: {
			enableIndicator: false,
			enableBadge: false,
			enablePreview: false,
			enableSound: false,
			unreadMessageTitleText: "New Message",
			unreadMessageTitleTextPlural: "New Messages",
		},
		homeScreen: {
			enabled: true,
			welcomeText: "Welcome! How can we help you?",
			background: {
				imageUrl: "",
				color: "",
			},
			startConversationButtonText: "Start conversation",
			previousConversations: {
				enabled: true,
				buttonText: "Previous conversations",
				title: "",
			},
			conversationStarters: {
				enabled: true,
				starters: [],
			},
		},
		teaserMessage: {
			text: "",
			teaserMessageDelay: 5000,
			showInChat: false,
			conversationStarters: {
				enabled: true,
				starters: [],
			},
		},
		chatOptions: {
			enabled: false,
			title: "Chat options",
			quickReplyOptions: {
				enabled: true,
				sectionTitle: "People are also interested in",
				quickReplies: [],
			},
			showTTSToggle: false,
			activateTTSToggle: true,
			labelTTSToggle: "Enable text-to-speech",
			rating: {
				enabled: "once",
				title: "Please rate your chat experience",
				commentPlaceholder: "Type something here...",

				submitButtonText: "Send feedback",
				eventBannerText: "Your feedback was submitted",
			},
			footer: {
				enabled: false,
				items: [],
			},
		},
		privacyNotice: {
			enabled: false,
			title: "Privacy notice",
			text: `Please accept our privacy policy to start your chat.

Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`,
			submitButtonText: "Submit",
			urlText: "",
			url: "",
		},
		fileAttachmentMaxSize: 10485760,
		maintenance: {
			enabled: false,
			mode: "inform",
			text: "",
			title: ""
		},
		demoWebchat: {
			enabled: true,
			backgroundImageUrl: "",
			position: "centered",
		},


		// Settings related to the webchat browser embedding
		// These settings are NOT configurable via the Endpoint Editor in Cognigy.AI
		embeddingConfiguration: {
			_endpointTokenUrl: "",
			awaitEndpointConfig: false,
			disableLocalStorage: false,
			disablePersistentHistory: false,
			useSessionStorage: false,
			connectivity: {
				enabled: false,
				mode: "hide",
				text: "",
				timeout: 2000,
				title: "",
			}
		},

		// Additional Settings to configure the webchat widget behavior
		// These settings are NOT configurable via the Endpoint Editor in Cognigy.AI
		widgetSettings: {
			disableDefaultReplyCompatiblityMode: false,
			enableStrictMessengerSync: false,

			disableHtmlInput: false,
			disableInputAutofocus: false,
			disableRenderURLsAsLinks: false,
			disableTextInputSanitization: false,
			disableToggleButton: false,
			enableAutoFocus: false,
			enableInjectionWithoutEmptyHistory: false,
			enableFocusTrap: false,
			enableDefaultPreview: false,
			ignoreLineBreaks: false,
			STTLanguage: "",

			sourceDirectionMapping: {
				agent: 'incoming',
				bot: 'incoming',
				engagement: 'incoming',
				user: 'outgoing',
			},
			sourceColorMapping: {
				agent: 'primary',
				bot: 'primary',
				engagement: 'primary',
				user: 'neutral',
			},
		},
	},
});

export const APPLY_WEBCHAT_SETTINGS_OVERRIDES = "APPLY_WEBCHAT_SETTINGS_OVERRIDES";
export const applyWebchatSettingsOverrides = (payload: Partial<IWebchatSettings>) => ({
	type: APPLY_WEBCHAT_SETTINGS_OVERRIDES as "APPLY_WEBCHAT_SETTINGS_OVERRIDES",
	payload,
});
export type ApplyWebchatSettingsOverridesAction = ReturnType<typeof applyWebchatSettingsOverrides>;

export const SET_CONFIG = "SET_CONFIG";
export const setConfig = (config: Partial<Omit<ConfigState, "settings"> & { settings: Partial<IWebchatSettings> }>) => ({
	type: SET_CONFIG as "SET_CONFIG",
	config,
});
export type SetConfigAction = ReturnType<typeof setConfig>;

export const UPDATE_SETTINGS = "UPDATE_SETTINGS";
export const updateSettings = (payload: Partial<IWebchatSettings>) => ({
	type: UPDATE_SETTINGS as "UPDATE_SETTINGS",
	payload,
});
export type UpdateSettingsAction = ReturnType<typeof updateSettings>;

const SET_INITIAL_SESSION_ID = 'SET_INITIAL_SESSION_ID';
export const setInitialSessionId = (sessionId: string) => ({
	type: SET_INITIAL_SESSION_ID as 'SET_INITIAL_SESSION_ID',
	sessionId
});
export type SetInitialSessionAction = ReturnType<typeof setInitialSessionId>;

export const config: Reducer<
	ConfigState,
	SetConfigAction | UpdateSettingsAction | ApplyWebchatSettingsOverridesAction | SetInitialSessionAction
> = (state = getInitialState(), action) => {
	switch (action.type) {
		case "SET_CONFIG": {
			// deepMerge the settings since we have nested settings since v3
			const mergedSettings = merge({}, state.settings, action.config.settings)

			return {
				...state,
				...action.config,
				settings: mergedSettings,
			};
		}

		case "APPLY_WEBCHAT_SETTINGS_OVERRIDES":
		case "UPDATE_SETTINGS": {
			// deepMerge the settings since we have nested settings since v3
			const mergedSettings = merge({}, state.settings, action.payload)

			return {
				...state,
				settings: mergedSettings,
			};
		}
		case "SET_INITIAL_SESSION_ID": {
			return { ...state, initialSessionId: action.sessionId };
		}
	}

	return state;
};
