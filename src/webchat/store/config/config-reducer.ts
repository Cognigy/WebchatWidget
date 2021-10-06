import { Reducer } from "redux";
import {
  IWebchatConfig,
  IWebchatSettings,
} from "../../../common/interfaces/webchat-config";

export type ConfigState = IWebchatConfig;

const getInitialState = (): ConfigState => ({
  URLToken: "",
  active: false,
  settings: {
    agentAvatarUrl: "",
    backgroundImageUrl: "",
    colorScheme: "",
    designTemplate: 1,
    disableBranding: false,
    disableHtmlContentSanitization: false,
    disableHtmlInput: false,
    disableInputAutocomplete: false,
    disableInputAutofocus: false,
    disableLocalStorage: false,
    disablePersistentHistory: false,
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
    enablePersistentMenu: false,
    enableRating: "onRequest",
    enableStrictMessengerSync: false,
    enableSTT: false,
    enableTTS: false,
    enableTypingIndicator: false,
    enableUnreadMessageBadge: false,
    enableUnreadMessagePreview: false,
    enableUnreadMessageSound: false,
    enableUnreadMessageTitleIndicator: false,
    engagementMessageDelay: 5000,
    engagementMessageText: "",
    focusInputAfterPostback: false,
    getStartedButtonText: "",
    getStartedPayload: "",
    getStartedText: "",
    headerLogoUrl: "",
    ignoreLineBreaks: false,
    inputPlaceholder: "",
    messageDelay: 1000,
    messageLogoUrl: "",
    persistentMenu: {
      title: "",
      menuItems: [],
    },
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
  },
});

export const SET_CONFIG = "SET_CONFIG";
export const setConfig = (config: ConfigState) => ({
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

export const config: Reducer<
  ConfigState,
  SetConfigAction | UpdateSettingsAction
> = (state = getInitialState(), action) => {
  switch (action.type) {
    case "SET_CONFIG": {
      return {
        ...state,
        ...action.config,
        settings: {
          ...state.settings,
          ...action.config.settings,
        },
      };
    }
    case "UPDATE_SETTINGS": {
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };
    }
  }

  return state;
};
