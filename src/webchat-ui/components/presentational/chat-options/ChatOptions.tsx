import React from "react";
import styled from "@emotion/styled";
import { IWebchatConfig } from "../../../../common/interfaces/webchat-config";
import { Typography } from "@cognigy/chat-components";
import { RatingWidget } from "./RatingWidget";
import { PostbackButtons } from "./PostbackButtons";
import { WebchatUIProps } from "../../WebchatUI";

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


const ChatOptionsFooter = styled.div(({ theme }) => ({
	alignItems: " center",
	justifyContent: "center",
	padding: "12px 0px",
	gap: 24,
	width: "100%",
	display: "flex",	
	backgroundColor: theme.backgroundWebchat,
	borderTop: `1px solid var(--basics-black-80, ${theme.black80})`,    
}));

const StyledFooterTypography = styled(Typography)(() => ({
	lineHeight: "19.6px",
	wordWrap: "break-word",
	margin: 0,
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
	onSendRating: (props: IOnSendRatingProps) => void;
	onEmitAnalytics: WebchatUIProps["onEmitAnalytics"];
	onSendActionButtonMessage: WebchatUIProps["onSendMessage"];
}

export const ChatOptions = (props: IChatOptionsProps) => {
	const { config, onSendRating, onEmitAnalytics, onSendActionButtonMessage } = props;
	const {ratingTitleText,	ratingCommentText} = config.settings;

	return (
		<ChatOptionsRoot className="webchat-chat-options-root">
			<ChatOptionsContainer className="webchat-chat-options-container">
				<PostbackButtons
					config={config}
					onSendActionButtonMessage={onSendActionButtonMessage}
					onEmitAnalytics={onEmitAnalytics}
				/>
				<DividerWrapper>
					<Divider />
				</DividerWrapper>
				<RatingWidget 
					ratingTitleText={ratingTitleText}
					ratingCommentText={ratingCommentText}
					onSendRating={onSendRating}
				/>				
			</ChatOptionsContainer>
			<ChatOptionsFooter className="webchat-chat-options-footer">
				<StyledFooterTypography variant="body-semibold">Imprint</StyledFooterTypography>
				<StyledFooterTypography variant="body-semibold">Data Privacy</StyledFooterTypography>
			</ChatOptionsFooter>
		</ChatOptionsRoot>
	);
};
