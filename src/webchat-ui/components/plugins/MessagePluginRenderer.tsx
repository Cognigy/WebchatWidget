import React from "react";
import { IMessage } from "@cognigy/socket-client/lib/interfaces/messageData";
import { MessagePlugin } from "../../../common/interfaces/message-plugin";
import { MessageSender } from "../../interfaces";
import { getPluginsForMessage } from "../../../plugins/helper";
import styled from "@emotion/styled";
import { IWebchatTheme } from "../../style";
import "../../../assets/style.css";
import {
	IWebchatConfig,
	TSourceColorV2,
	TSourceDirection,
} from "../../../common/interfaces/webchat-config";

import { Message } from "@cognigy/chat-components";

export interface MessageProps extends React.HTMLProps<HTMLDivElement> {
	config: IWebchatConfig;
	hideAvatar?: boolean;
	isFullscreen?: boolean;
	hasReply?: boolean;
	message: IMessage;
	onDismissFullscreen?: () => void;
	onEmitAnalytics: (name: string, payload?: any) => void;
	onSendMessage: MessageSender;
	onSetFullscreen?: () => void;
	plugins: MessagePlugin[];
	prevMessage?: IMessage;
	setScrollToPosition?: (position: number) => void;
	webchatTheme: IWebchatTheme;
	isConversationEnded: boolean;
	openXAppOverlay?: (url: string | undefined) => void;
}

const MessagePluginRenderer = ({
	config,
	hideAvatar,
	isFullscreen,
	hasReply,
	message,
	onDismissFullscreen,
	onEmitAnalytics,
	onSendMessage,
	onSetFullscreen,
	plugins,
	prevMessage,
	setScrollToPosition,
	webchatTheme,
	isConversationEnded,
	openXAppOverlay,
	...props
}: MessageProps): JSX.Element => {
	const attributes = Object.keys(props).length > 0 ? props : undefined;

	const matchedPlugins = getPluginsForMessage(plugins, config)(message);
	const source = message.source;

	const className = (() => {
		switch (source) {
			case "user":
				return "webchat-message-row user";

			case "bot":
				return "webchat-message-row bot";

			case "agent":
				return "webchat-message-row agent";

			case "engagement":
				return "webchat-message-row engagement";

			default:
				return "webchat-message-row";
		}
	})();

	const avatarClassName = (() => {
		switch (source) {
			case "user":
				return "webchat-avatar user";

			case "bot":
				return "webchat-avatar bot";

			case "agent":
				return "webchat-avatar agent";

			case "engagement":
				return "webchat-avatar engagement";

			default:
				return "webchat-avatar";
		}
	})();

	const direction = ((): TSourceDirection => {
		const configDirection = config.settings.widgetSettings.sourceDirectionMapping[source];

		if (configDirection) return configDirection;

		return "incoming";
	})();

	const color = ((): TSourceColorV2 => {
		const configColor = config.settings.widgetSettings.sourceColorMapping[source];

		if (configColor) return configColor;

		return "neutral";
	})();

	const align = direction === "incoming" ? "left" : "right";

	const messageSource = (() => {
		switch (source) {
			case "user":
				return "I say: ";

			case "bot":
				return "Bot says: ";

			case "agent":
				return "Agent says: ";

			case "engagement":
				return "Bot says: ";

			default:
				return "Message says: ";
		}
	})();


		return (
			<Message
				action={onSendMessage}
				config={config}
				hasReply={hasReply}
				isConversationEnded={isConversationEnded}
				isFullscreen={isFullscreen}
				message={message}
				onDismissFullscreen={onDismissFullscreen}
				onEmitAnalytics={onEmitAnalytics}
				onSetFullscreen={onSetFullscreen}
				openXAppOverlay={openXAppOverlay}
				plugins={plugins}
				prevMessage={prevMessage}
				theme={webchatTheme}
			/>
		);
};

export default MessagePluginRenderer;
