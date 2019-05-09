import { Reducer } from "redux";
import { IWebchatConfig } from "@cognigy/webchat-client/lib/interfaces/webchat-config";

export type ConfigState = IWebchatConfig;

const getInitialState = (): ConfigState => ({
    URLToken: '',
    active: false,
    settings: {
        backgroundImageUrl: '',
        colorScheme: '',
        designTemplate: 1,
        startBehavior: 'none',
        enableFileUpload: false,
        enablePersistentMenu: false,
        enableSTT: false,
        enableTTS: false,
        enableTypingIndicator: false,
        getStartedButtonText: '',
        getStartedPayload: '',
        getStartedText: '',
        headerLogoUrl: '',
        inputPlaceholder: '',
        messageDelay: 1000,
        messageLogoUrl: '',
        persistentMenu: {
            title: '',
            menuItems: []
        },
        STTLanguage: '',
        title: ''
    }
});

const SET_CONFIG = 'SET_CONFIG';
export const setConfig = (config: ConfigState) => ({
    type: SET_CONFIG as 'SET_CONFIG',
    config
});
export type SetConfigAction = ReturnType<typeof setConfig>;

export const config: Reducer<ConfigState, SetConfigAction> = (state = getInitialState(), action) => {

    switch (action.type) {
        case 'SET_CONFIG': {

            return {
                ...state,
                ...action.config,
                settings: {
                    ...state.settings,
                    ...action.config.settings
                }
            }
        }
    }

    return state;
}