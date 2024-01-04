import React from "react";
import styled from "@emotion/styled";
import { IWebchatConfig } from "../../../../common/interfaces/webchat-config";
import { RatingWidget } from "./RatingWidget";
import { PostbackButtons } from "./PostbackButtons";
import { WebchatUIProps } from "../../WebchatUI";
import { ChatOptionsFooter } from "./ChatOptionsFooter";

const ChatOptionsRoot = styled.div(() => ({
	width: "100%",
	height: "100%",
	display: "flex",
	flexDirection: "column",
}));

const ChatOptionsContainer = styled.div(() => ({
	width: "100%",
	height: "100%",
	display: "flex",
	padding: "0 20px",
	flexDirection: "column",
}));

const DividerWrapper = styled.div(() => ({
	padding: "12px 0px",
}));

const Divider = styled.div(({ theme }) => ({
	height: 1,
	width: "100%",
	backgroundColor: theme.black80,
}));

interface IOnSendRatingProps {
	rating: number | null;
	comment: string;
}

interface IChatOptionsProps {
	config: IWebchatConfig;
	ratingTitleText: string;
	ratingCommentText: string;
	showOnlyRating?: boolean;
	onSendRating: (props: IOnSendRatingProps) => void;
	onEmitAnalytics: WebchatUIProps["onEmitAnalytics"];
	onSendActionButtonMessage: WebchatUIProps["onSendMessage"];
}

export const ChatOptions = (props: IChatOptionsProps) => {
	const {
		config,
		showOnlyRating,
		ratingTitleText,
		ratingCommentText,
		onSendRating,
		onEmitAnalytics,
		onSendActionButtonMessage,
	} = props;

	return (
		<ChatOptionsRoot className="webchat-chat-options-root">
			<ChatOptionsContainer className="webchat-chat-options-container">
				{!showOnlyRating && (
					<>
						<PostbackButtons
							config={config}
							onSendActionButtonMessage={onSendActionButtonMessage}
							onEmitAnalytics={onEmitAnalytics}
						/>
						<DividerWrapper>
							<Divider />
						</DividerWrapper>
					</>
				)}
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
