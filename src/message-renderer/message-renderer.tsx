import * as React from "react";
import * as ReactDOM from "react-dom";
import { IMessage } from "../common/interfaces/message";
import { IWebchatConfig } from "../common/interfaces/webchat-config";
import MessageRendererComponent from "./MessageRenderer";
import { getMessageRendererConfig } from "./getMessageRendererConfig";
import { getMessageRendererPlugins } from "./getMessageRendererPlugins";
import { getPluginsForMessage } from "../plugins/helper";

export class MessageRenderer {
	static renderMessage(message: IMessage, target: HTMLElement, config?: IWebchatConfig) {
		ReactDOM.render(<MessageRendererComponent message={message} config={config} />, target);
	}
	static getPluginsForMessage(message: IMessage, config?: IWebchatConfig) {
		const fullConfig = getMessageRendererConfig(config);
		const plugins = getMessageRendererPlugins();
		const matcher = getPluginsForMessage(plugins, fullConfig);
		const matchedPlugins = matcher(message);

		return matchedPlugins;
	}
	static isMessageSupported(message: IMessage, config?: IWebchatConfig) {
		return MessageRenderer.getPluginsForMessage(message, config).length > 0;
	}
}
