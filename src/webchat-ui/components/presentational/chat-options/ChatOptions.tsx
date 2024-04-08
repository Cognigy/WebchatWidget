import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { IWebchatConfig } from "../../../../common/interfaces/webchat-config";
import { RatingWidget } from "./RatingWidget";
import { PostbackButtons } from "./PostbackButtons";
import { WebchatUIProps } from "../../WebchatUI";
import { ChatOptionsFooter } from "./ChatOptionsFooter";
import getKeyboardFocusableElements from "../../../utils/find-focusable";

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

export interface IOnSendRatingProps {
	rating: number | null;
	comment: string;
	showRatingStatus: boolean;
}

interface IChatOptionsProps {
	config: IWebchatConfig;
	ratingTitleText: string;
	ratingCommentText: string;
	ratingSubmitButtonText: string;
	ratingEventBannerText: string;
	showOnlyRating: boolean;
	hasGivenRating: boolean;
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
		ratingSubmitButtonText,
		ratingEventBannerText,
		hasGivenRating,
		onSendRating,
		onEmitAnalytics,
		onSendActionButtonMessage,
	} = props;
	const { settings } = config;
	const { chatOptions } = settings;

	const chatOptionsRef = useRef<HTMLDivElement>(null);

	const ratingEnabled = chatOptions.rating.enabled;
	const showRating =
		ratingEnabled === "always" ||
		(ratingEnabled === "once" && !hasGivenRating) ||
		showOnlyRating;

	useEffect(() => {
		if (chatOptionsRef?.current) {
			const { firstFocusable } = getKeyboardFocusableElements(chatOptionsRef?.current);
			if (firstFocusable) {
				firstFocusable.focus();
			}
		}
	}, []);

	return (
		<ChatOptionsRoot className="webchat-chat-options-root" ref={chatOptionsRef}>
			<ChatOptionsContainer className="webchat-chat-options-container">
				{!showOnlyRating && config.settings.chatOptions.quickReplyOptions.enabled && (
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
				{showRating && (
					<RatingWidget
						ratingTitleText={ratingTitleText}
						ratingCommentText={ratingCommentText}
						onSendRating={onSendRating}
						showRatingStatus={showOnlyRating}
						ratingEventBannerText={ratingEventBannerText}
						buttonText={ratingSubmitButtonText}
					/>
				)}
			</ChatOptionsContainer>
			{chatOptions.footer.enabled && chatOptions.footer.items[0] && (
				<ChatOptionsFooter settings={config.settings} />
			)}
		</ChatOptionsRoot>
	);
};
