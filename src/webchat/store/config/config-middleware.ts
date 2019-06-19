import { WebchatClient } from "@cognigy/webchat-client";
import { Middleware } from "redux";
import { StoreState } from "../store";
import { setConfig } from "./config-reducer";
import { IWebchatSettings } from "@cognigy/webchat-client/lib/interfaces/webchat-config";

export interface ISendMessageOptions {
    /* overrides the displayed text within a chat bubble. useful for e.g. buttons */
    label: string;
}

const LOAD_CONFIG = 'LOAD_CONFIG';
export const loadConfig = () => ({
    type: LOAD_CONFIG as 'LOAD_CONFIG'
});
export type LoadConfigAction = ReturnType<typeof loadConfig>;

// forwards messages to the socket
export const createConfigMiddleware = (client: WebchatClient, defaultSettings?: IWebchatSettings): Middleware<{}, StoreState> => store => next => (action: LoadConfigAction) => {
    switch (action.type) {
        case 'LOAD_CONFIG': {
            if (!client.webchatConfig) {
                client.loadWebchatConfig()
                    .then(() => {
                        // set the webchat settings (overridable by embed default settings)
                        const settings = {
                            ...client.webchatConfig.settings,
                            ...defaultSettings
                        }
                        
                        store.dispatch(setConfig({
                            ...client.webchatConfig,
                            settings
                        }));
                    })
            }

            break;
        }
    }

    return next(action);
}