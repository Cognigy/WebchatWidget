import React from "react";
import styled from "@emotion/styled";
import { ActionButtons, Typography } from "@cognigy/chat-components";
import UnreadMessagePreview from "./UnreadMessagePreview";
import CloseIcon from "../../assets/close-16px.svg";
import CognigyAIAvatar from "../../assets/cognigy-ai-avatar-28px.svg";
import { IWebchatButton } from "@cognigy/socket-client";
import { WebchatUIProps } from "../WebchatUI";
import { IWebchatConfig } from "../../../common/interfaces/webchat-config";
import { ISendMessageOptions } from "../../../webchat/store/messages/message-middleware";
import { useMediaQuery } from "react-responsive";

const TeaserMessageRoot = styled.div(({ theme }) => ({
	position: "fixed",
	right: "20px",
	bottom: "84px",

	display: "flex",
	flexDirection: "column",
	alignItems: "flex-end",
	gap: "16px",
}));

const TeaserMessageHeader = styled.div(() => ({
	display: "flex",
	alignSelf: "stretch",
	alignItems: "center",
	gap: "12px",
}));

const TeaserMessageHeaderContent = styled.div(() => ({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "flex-start",
	flex: "1 0 0",
}));

const CloseIconWrapper = styled.div(({ theme }) => ({
	svg: {
		fill: theme.textDark,
		width: 16,
		height: 16,
	},
}));

const ButtonContainer = styled.div(() => ({
	".webchat-teaser-message-button-container": {
		display: "flex",
		width: 315,
		justifyContent: "flex-end",
		alignItems: "center",
		alignContent: "center",
		gap: "8px",
		flexWrap: "wrap",
	}
}));

interface ITeaserMessageProps {
	messageText: string;
	onToggle: () => void;
	onEmitAnalytics: WebchatUIProps["onEmitAnalytics"];
	onSendActionButtonMessage: WebchatUIProps["onSendMessage"];
	config: IWebchatConfig;
	onHideTeaserMessage: () => void;
	wasOpen: boolean;
}

// TODO: Load buttons from new endpoint config
const buttons: IWebchatButton[] = [
	{
		title: "I want to learn more about Cognigy",
		type: "postback",
		payload: "I want to learn more about Cognigy",
	},
	{
		title: "I'd like to talk to a product expert",
		type: "postback",
		payload: "I'd like to talk to a product expert",
	},
	{
		title: "Visit Website",
		type: "web_url",
		url: "https://www.cognigy.com/",
	},
]

export const TeaserMessage = (props: ITeaserMessageProps) => {
	const { onToggle, messageText, config, onEmitAnalytics, onSendActionButtonMessage, onHideTeaserMessage, wasOpen } = props;

	// const buttons: IWebchatButton[] = config.settings.conversationStarters.starters;

	const isDesktopMedia = useMediaQuery({ query: "(min-width: 576px)" });

	const handleMessageClick = () => {
		onToggle();
	};

	const handleActionButtonClick = (text?: string, data?: any, options?: Partial<ISendMessageOptions>) => {
		onSendActionButtonMessage(text, data, options);
		onToggle();
	};

	const handleHideTeaserMessage = (e: React.MouseEvent<HTMLInputElement>) => {
		e.stopPropagation();
		e.preventDefault();
		onHideTeaserMessage();
	};

	return (
		<TeaserMessageRoot className="webchat-teaser-message-root">
			<UnreadMessagePreview
				className="webchat-teaser-message-bubble"
				onClick={handleMessageClick}
				aria-live="polite"
			>
				<TeaserMessageHeader>
					<CognigyAIAvatar />
					<TeaserMessageHeaderContent>
						<Typography
							variant="title2-regular"
							className="webchat-teaser-message-header-title"
							margin={0}
						>
							{config.settings.layout.title || "Cognigy"}
						</Typography>
						<CloseIconWrapper className="webchat-teaser-message-header-close-button">
							<CloseIcon onClick={handleHideTeaserMessage} />
						</CloseIconWrapper>
					</TeaserMessageHeaderContent>
				</TeaserMessageHeader>
				<span className="sr-only">
					New message preview
				</span>
				<Typography
					variant="body-regular"
					className="webchat-unread-message-preview-text"
					margin={0}
				>
					{messageText}
				</Typography>
			</UnreadMessagePreview>
			{!wasOpen &&
				<ButtonContainer className="webchat-teaser-message-action-buttons">
					<ActionButtons
						showUrlIcon
						buttonClassName="webchat-teaser-message-button"
						containerClassName="webchat-teaser-message-button-container"
						payload={buttons}
						config={config}
						action={handleActionButtonClick}
						onEmitAnalytics={onEmitAnalytics}
						size={isDesktopMedia ? "large" : "small"}
					/>
				</ButtonContainer>
			}
		</TeaserMessageRoot>
	);
};
