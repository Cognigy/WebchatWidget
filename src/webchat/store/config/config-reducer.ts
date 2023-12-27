import { Reducer } from "redux";
import {
  IWebchatConfig,
  IWebchatSettings,
} from "../../../common/interfaces/webchat-config";

export type ConfigState = IWebchatConfig;

export const getInitialState = (): ConfigState => ({
  URLToken: "",
  initialSessionId: "",
  active: false,
  isConfigLoaded: false,
  isTimedOut: false,
  settings: {
    agentAvatarUrl: "",
    awaitEndpointConfig: false,
    backgroundImageUrl: "",
    businessHours: {
      businessHours: [],
      enabled: false,
      mode: "inform",
      text: "",
      timeZone: "Europe/Berlin",
      title: "",
    },
    colorScheme: "",
    connectivity: {
      enabled: false,
      mode: "hide",
      text: "",
      timeout: 2000,
      title: ""
    },
    designTemplate: 1,
    disableBranding: false,
    disableDefaultReplyCompatiblityMode: false,
    disableHtmlContentSanitization: false,
    disableHtmlInput: false,
    disableInputAutocomplete: false,
    disableInputAutofocus: false,
    disableLocalStorage: false,
    disablePersistentHistory: false,
    disableRenderURLsAsLinks: false,
    disableTextInputSanitization: false,
    disableToggleButton: false,
    disableUrlButtonSanitization: false,
    dynamicImageAspectRatio: false,
    enableAutoFocus: false,
    enableConnectionStatusIndicator: true,
    enableFileUpload: false,
    enableFocusTrap: false,
    enableGenericHTMLStyling: false,
    enableInjectionWithoutEmptyHistory: false,
    enableInputCollation: false,
    enableRating: "onRequest",
    enableStrictMessengerSync: false,
    enableSTT: false,
    enableTTS: false,
    enableTypingIndicator: false,
    enableUnreadMessageBadge: false,
    enableUnreadMessagePreview: false,
    enableUnreadMessageSound: false,
    enableUnreadMessageTitleIndicator: false,
    enableDefaultPreview: false,
    enableFileAttachment: false,
    fileAttachmentMaxSize: 10485760,
    engagementMessageDelay: 5000,
    engagementMessageText: "",
    focusInputAfterPostback: false,
    getStartedButtonText: "",
    getStartedData: {},
    getStartedPayload: "",
    getStartedText: "",
    headerLogoUrl: "",
    ignoreLineBreaks: false,
    inputAutogrowMaxRows: 4,
    inputCollationTimeout: 1000,
    inputPlaceholder: "",
    maintenance: {
      enabled: false,
      mode: "inform",
      text: "",
      title: ""
    },
    messageDelay: 1000,
    messageLogoUrl: "",
    ratingCommentText: "Feel free to leave a comment.",
    ratingMessageHistoryCommentText: "You commented:",
    ratingMessageHistoryRatingText: "You gave the following rating:",
    ratingTitleText: "Please rate your chat experience",
    showEngagementMessagesInChat: false,
    startBehavior: "none",
    STTLanguage: "",
    title: "",
    unreadMessageTitleText: "New Message",
    unreadMessageTitleTextPlural: "New Messages",
    userAvatarUrl: "",
    useSessionStorage: false,
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
    _endpointTokenUrl: "",
    privacyMessage: `Please accept our privacy policy to start your chats

This website uses the messaging software Cognigy, which enables you to have conversations with us. Cognigy needs to save some cookies on your device. Your data is safe though and it will not be used to identify you personally. To learn more, please read our Privacy Policy.`,
    privacyUrl: "https://www.cognigy.com/",
  },
});

export const APPLY_WEBCHAT_SETTINGS_OVERRIDES = "APPLY_WEBCHAT_SETTINGS_OVERRIDES";
export const applyWebchatSettingsOverrides = (payload: Partial<IWebchatSettings>) => ({
  type: APPLY_WEBCHAT_SETTINGS_OVERRIDES as "APPLY_WEBCHAT_SETTINGS_OVERRIDES",
  payload,
});
export type ApplyWebchatSettingsOverridesAction = ReturnType<typeof applyWebchatSettingsOverrides>;

export const SET_CONFIG = "SET_CONFIG";
export const setConfig = (config: Partial<ConfigState>) => ({
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
      return {
        ...state,
        ...action.config,
        settings: {
          ...state.settings,
          ...action.config.settings,
          sourceDirectionMapping: {
            ...state.settings.sourceDirectionMapping,
            ...action.config.settings?.sourceDirectionMapping,
          },
          sourceColorMapping: {
            ...state.settings.sourceColorMapping,
            ...action.config.settings?.sourceColorMapping
          }
        },
      };
    }

    case "APPLY_WEBCHAT_SETTINGS_OVERRIDES":
    case "UPDATE_SETTINGS": {
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
          sourceDirectionMapping: {
            ...state.settings.sourceDirectionMapping,
            ...action.payload?.sourceDirectionMapping,
          },
          sourceColorMapping: {
            ...state.settings.sourceColorMapping,
            ...action.payload?.sourceColorMapping
          }
        },
      };
    }
    case "SET_INITIAL_SESSION_ID": {
      return { ...state, initialSessionId: action.sessionId };
    }
  }

  return state;
};
