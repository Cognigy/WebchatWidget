export interface IPersistentMenuItem {
  title: string;
  payload: string;
}

export type TSourceDirection = 'incoming' | 'outgoing';

export interface IWebchatSettings {
  agentAvatarUrl: string;
  backgroundImageUrl: string;
  colorScheme: string;
  designTemplate: number;
  disableBranding: boolean;
  disableHtmlContentSanitization: boolean;
  disableHtmlInput: boolean;
  disableInputAutofocus: boolean;
  disableLocalStorage: boolean;
  disablePersistentHistory: boolean;
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
  enablePersistentMenu: boolean;
  enableRating: "always" | "once" | "onRequest";
  enableStrictMessengerSync: boolean;
  enableSTT: boolean;
  enableTTS: boolean;
  enableTypingIndicator: boolean;
  enableUnreadMessageBadge: boolean;
  enableUnreadMessagePreview: boolean;
  enableUnreadMessageSound: boolean;
  enableUnreadMessageTitleIndicator: boolean;
  engagementMessageDelay: number;
  engagementMessageText: string;
  focusInputAfterPostback: boolean;
  getStartedButtonText: string;
  getStartedPayload: string;
  getStartedText: string;
  headerLogoUrl: string;
  ignoreLineBreaks: boolean;
  inputPlaceholder: string;
  messageDelay: number;
  /** TODO: this is the botAvatarUrl (rename for major) */
  messageLogoUrl: string;
  persistentMenu: {
    title: string;
    menuItems: IPersistentMenuItem[];
  };
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
  }
}

export interface IWebchatConfig {
  active: boolean;
  URLToken: string;
  settings: IWebchatSettings;
}
