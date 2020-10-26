export interface IPersistentMenuItem {
    title: string;
    payload: string;
}

export interface IWebchatSettings {
    agentAvatarUrl: string;
    backgroundImageUrl: string;
    colorScheme: string;
    designTemplate: number;
    disableBranding: boolean;
    disableHtmlInput: boolean;
    disableInputAutofocus: boolean;
    disableLocalStorage: boolean;
    disablePersistentHistory: boolean;
    disableTextInputSanitization: boolean;
    disableToggleButton: boolean;
    disableUnreadMessageIndicator: boolean;
    disableUnreadMessagePreview: boolean;
    dynamicImageAspectRatio: boolean;
    enableConnectionStatusIndicator: boolean;
    enableFileUpload: boolean;
    enablePersistentMenu: boolean;
    enableSTT: boolean;
    enableStrictMessengerSync: boolean;
    enableTTS: boolean;
    enableTypingIndicator: boolean;
    enableUnreadTitleIndicator: boolean;
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
    startBehavior: "none" | "button" | "injection";
    STTLanguage: string;
    title: string;
    unreadMessageWebsiteTitle: string;
    userAvatarUrl: string;
    useSessionStorage: boolean;
}

export interface IWebchatConfig {
    active: boolean;
    URLToken: string;
    settings: IWebchatSettings;
}
