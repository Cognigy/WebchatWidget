import { Middleware } from "redux";
import { StoreState } from "../store";
import { setConfig, ConfigState, applyWebchatSettingsOverrides } from "./config-reducer";
import { fetchWebchatConfig } from "../../helper/endpoint";
import { IWebchatSettings } from "../../../common/interfaces/webchat-config";

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
export const createConfigMiddleware = (url: string, overrideWebchatSettings?: IWebchatSettings): Middleware<{}, StoreState> => store => next => (action: LoadConfigAction) => {
    switch (action.type) {
        case 'LOAD_CONFIG': {
            // we might want to check whether we need to fetch the config

            // this needs to be applied in order to make sure we're restoring from/to the correct store
            // according to the embedding settings to avoid a race condition where the "default value" (local storage)
            // is used in case the config was not fetched yet
            if (overrideWebchatSettings) {
                store.dispatch(applyWebchatSettingsOverrides(overrideWebchatSettings));
            }

            (async () => {
                const endpointConfig = await fetchWebchatConfig(url);
                
                const settings: IWebchatSettings = {
                    ...endpointConfig.settings,
                    ...overrideWebchatSettings
                };

                const config: ConfigState = {
                    ...endpointConfig,
                    settings
                };

                store.dispatch(setConfig(config));
            })();
            

            break;
        }
    }

    return next(action);
}