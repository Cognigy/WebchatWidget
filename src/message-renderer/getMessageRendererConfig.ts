import { IWebchatConfig } from "../common/interfaces/webchat-config";
import { getInitialState } from "../webchat/store/config/config-reducer";

/**
 * returns a full webchat config based on a partial webchat config
 * passed as options that's used for the message renderer
 *
 * @param options
 * @returns
 */
export const getMessageRendererConfig = (options?: IWebchatConfig): IWebchatConfig => {
	const defaultConfig = getInitialState();

	return {
		...defaultConfig,
		...options,
		settings: {
			...defaultConfig.settings,
			...options?.settings,
		},
	};
};
