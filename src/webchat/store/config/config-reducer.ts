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
    disableHtmlInput: false,
    disableInputAutofocus: false,
    disableLocalStorage: false,
    disablePersistentHistory: false,
    disableTextInputSanitization: false,
    disableToggleButton: false,
    dynamicImageAspectRatio: false,
    enableConnectionStatusIndicator: true,
    showEngagementMessagesInChat: false,
    enableAutoFocus: false,
    enableInjectionWithoutEmptyHistory: false,
    enableFileUpload: false,
    enableFocusTrap: false,
    enableGenericHTMLStyling: false,
    enablePersistentMenu: false,
    enableRating: "onRequest",
    enableSTT: false,
    enableStrictMessengerSync: false,
    enableTTS: false,
    enableTypingIndicator: false,
    enableUnreadMessageBadge: false,
    enableUnreadMessagePreview: false,
    enableUnreadMessageSound: false,
    enableUnreadMessageTitleIndicator: false,
    engagementMessageText: "",
    focusInputAfterPostback: false,
    engagementMessageDelay: 5000,
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
	  ratingTitleText: "Please rate your chat experience",
	  ratingCommentText: "Feel free to leave a comment.",
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
