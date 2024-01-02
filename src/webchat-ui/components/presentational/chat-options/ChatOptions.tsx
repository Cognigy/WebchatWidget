import React from "react";
import styled from "@emotion/styled";
import { IWebchatConfig } from "../../../../common/interfaces/webchat-config";
import { Typography } from "@cognigy/chat-components";
import { RatingWidget } from "./RatingWidget";

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
	alignSelf: "flex-end",
	alignItems: " center",
	justifyContent: "center",
	width: "100%",
    height: 44,
    padding: "12px 0px",
	backgroundColor: theme.backgroundWebchat,
	borderTop: `1px solid var(--basics-black-80, ${theme.black80})`,    
    gap: 24,
    display: 'inline-flex'
}));

const StyledFooterTypography = styled(Typography)(() => ({
	lineHeight: 19.60,
	wordWrap: 'break-word',
}));

interface IOnSendRatingProps {
	rating: number | null;
	comment: string;
}

interface IChatOptionsProps {
	config: IWebchatConfig;
	onSendRating: (props: IOnSendRatingProps) => void;
}

export const ChatOptions = (props: IChatOptionsProps) => {
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
			<ChatOptionsFooter className="webchat-chat-options-footer">
                <StyledFooterTypography variant="body-semibold">Imprint</StyledFooterTypography>
                <StyledFooterTypography variant="body-semibold">Data Privacy</StyledFooterTypography>
			</ChatOptionsFooter>
		</ChatOptionsRoot>
	);
};
