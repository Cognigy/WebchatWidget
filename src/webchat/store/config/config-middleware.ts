import { Middleware } from "redux";
import { StoreState } from "../store";
import { setConfig, applyWebchatSettingsOverrides } from "./config-reducer";
import { fetchWebchatConfig } from "../../helper/endpoint";
import { IWebchatSettings } from "../../../common/interfaces/webchat-config";
import { merge } from 'lodash';

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
export const createConfigMiddleware = (url: string, overrideWebchatSettings?: Partial<IWebchatSettings>): Middleware<object, StoreState> => store => next => (action: LoadConfigAction) => {
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
				const endpointConfig = await fetchWebchatConfig(url, store.getState().config.settings.embeddingConfiguration?.connectivity?.enabled && store.getState().config.settings.embeddingConfiguration?.connectivity?.timeout || 4000);

                if(endpointConfig){
					// deepMerge the settings since we have nested settings since v3
					const settings = merge({}, endpointConfig.settings, overrideWebchatSettings)

					const config = {
                        ...endpointConfig,
                        settings
                    };

                    store.dispatch(setConfig({...config, isConfigLoaded: true}));
                }else if(overrideWebchatSettings){
					store.dispatch(setConfig({ settings: overrideWebchatSettings, isTimedOut: true, isConfigLoaded: true }));
                }else{
                    store.dispatch(setConfig({isTimedOut: true, isConfigLoaded: true}));
                }
                
                
            })();
            

            break;
        }
    }

    return next(action);
}