import React from "react";
import styled from "@emotion/styled";
import { ActionButtons, Typography } from "@cognigy/chat-components";
import { IWebchatConfig } from "../../../../common/interfaces/webchat-config";
import { WebchatUIProps } from "../../WebchatUI";

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

	const buttons = [
		{
			title: "Who are Cognigy?",
			type: "postback",
			payload: "Who are Cognigy?",
		},
		{
			title: "What can I do here?",
			type: "postback",
			payload: "What can I do here?",
		},
		{
			title: "I need technical support",
			type: "postback",
			payload: "I need technical support",
		},
	]

	return (
		<PostbackButtonsRoot className="webchat-chat-options-root">
            <Typography variant="title1-semibold" margin={0} className="webchat-chat-options-action-btns-title">
                People are also interested in
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
