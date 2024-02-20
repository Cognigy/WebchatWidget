import React from "react";
import styled from "@emotion/styled";
import { ActionButtons, Typography } from "@cognigy/chat-components";
import { IWebchatConfig } from "../../../../common/interfaces/webchat-config";
import { WebchatUIProps } from "../../WebchatUI";
import { IWebchatButton } from "@cognigy/socket-client";

const PostbackButtonsRoot = styled.div(() => ({
	display: "flex",
	flexDirection: "column",
	alignItems: "flex-start",
	gap: 24,
	alignSelf: "stretch",
	padding: "20px 0"
}));

const ActionButtonsWrapper = styled.div(() => ({
	display: "flex",
	width: "295px",
	flexDirection: "row",
	flexWrap: "wrap",
	alignItems: "flex-end",
	alignContent: "flex-end",
	gap: 8,
}));

interface IPostbackButtonsProps {
	config: IWebchatConfig;
	onEmitAnalytics: WebchatUIProps["onEmitAnalytics"];
	onSendActionButtonMessage: WebchatUIProps["onSendMessage"];
}


export const PostbackButtons = (prop: IPostbackButtonsProps) => {
	const { config, onSendActionButtonMessage, onEmitAnalytics } = prop;
	const { settings } = config;
	const { chatOptions } = settings;

	const buttons: IWebchatButton[] = chatOptions?.quickReplyOptions.quickReplies

	return (
		<PostbackButtonsRoot className="webchat-chat-options-root">
			<Typography variant="title1-semibold" margin={0} className="webchat-chat-options-action-btns-title">
				{
					chatOptions?.quickReplyOptions?.sectionTitle ||
					"People are also interested in"
				}
			</Typography>
			<ActionButtonsWrapper className="webchat-chat-options-action-btns-wrapper">
				<ActionButtons
					showUrlIcon
					buttonClassName="webchat-chat-options-button"
					containerClassName="webchat-chat-options-button-container"
					payload={buttons}
					config={config}
					action={onSendActionButtonMessage}
					onEmitAnalytics={onEmitAnalytics}
				/>
			</ActionButtonsWrapper>

		</PostbackButtonsRoot>
	);
};
