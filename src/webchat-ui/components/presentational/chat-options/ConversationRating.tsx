import React from "react";
import styled from "@emotion/styled";
import { IWebchatConfig } from "../../../../common/interfaces/webchat-config";
import { ChatOptionsFooter } from "./ChatOptionsFooter";
import { RatingWidget } from "./RatingWidget";
import { WebchatUIProps } from "../../WebchatUI";

const ChatOptionsRoot = styled.div(() => ({
	width: "100%",
	height: "100%",
}));

const ChatOptionsContainer = styled.div(() => ({
	width: "100%",
	height: "100%",
	display: "flex",
	padding: "0 20px",
	flexDirection: "column",
}));

interface IOnSendRatingProps {
	rating: number | null;
	comment: string;
}

interface IChatOptionsProps {
	config: IWebchatConfig;
	onSendRating: (props: IOnSendRatingProps) => void;
	onEmitAnalytics: WebchatUIProps["onEmitAnalytics"];
	onSendActionButtonMessage: WebchatUIProps["onSendMessage"];
}

export const ConversationRating = (props: IChatOptionsProps) => {
	const { config, onSendRating } = props;
	const {ratingTitleText,	ratingCommentText} = config.settings;

	return (
		<ChatOptionsRoot className="webchat-chat-options-root">
			<ChatOptionsContainer className="webchat-chat-options-container">
				<RatingWidget 
					ratingTitleText={ratingTitleText}
					ratingCommentText={ratingCommentText}
					onSendRating={onSendRating}
				/>				
			</ChatOptionsContainer>
			<ChatOptionsFooter />
		</ChatOptionsRoot>
	);
};
