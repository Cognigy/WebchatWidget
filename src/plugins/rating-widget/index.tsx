import React from "react";
import { ThemeProvider } from "@emotion/react";
import { registerMessagePlugin } from "../helper";
import { MessagePlugin, MessageComponentProps } from "../../common/interfaces/message-plugin";
import RatingWidget from "./RatingWidget";
import { IMessage } from "../../common/interfaces/message";
import { createWebchatTheme } from "../../webchat-ui/style";

interface IRating {
	rating: number;
	comment?: string;
}

export const getRating = (message: IMessage): IRating | null => {
	const { source, data } = message;

	// Show feedback submitted pill in chat only if showRatingStatus is true
	if (
		source === "user" &&
		data?._cognigy?.controlCommands?.[0]?.type === "setRating" &&
		data?._cognigy?.controlCommands?.[0]?.parameters?.showRatingStatus === true
	) {
		const { comment, rating } = message?.data?._cognigy?.controlCommands?.[0]?.parameters || {};

		return { comment, rating };
	}

	if ((message as any)?.rating !== undefined) {
		const { rating, ratingComment: comment } = message as any;

		return { rating, comment };
	}

	return null;
};

// Wrapper component to adapt RatingWidget to MessageComponentProps
const RatingWidgetPlugin = ({ message, config, onSendMessage, selectedRating, selectedRatingComment, isSimulation, theme }: MessageComponentProps) => {
	const pluginData = message.data?._plugin?.data || {};
	const ratingTitleText =
		pluginData.ratingTitleText ||
		config.settings.ratingTitleText ||
		"Please rate your chat experience";
	const ratingCommentText =
		pluginData.ratingCommentText ||
		config.settings.ratingCommentText ||
		"Feel free to leave a comment.";
	const buttonText = pluginData.ratingSubmitButtonText;
	const ratingEventBannerText = pluginData.ratingEventBannerText;
	const showRatingStatus = pluginData.showRatingStatus !== false;

	const handleSendRating = ({ rating, comment, showRatingStatus }: any) => {
		// Send rating via control command
		onSendMessage("", {
			_cognigy: {
				controlCommands: [
					{
						type: "setRating",
						parameters: {
							rating,
							comment,
							showRatingStatus,
						},
					},
				],
			},
		});
	};

	// Use theme from props if available, otherwise create from config
	const webchatTheme = theme || createWebchatTheme({
		primaryColor: config.settings.colorScheme
	});

	return (
		<ThemeProvider theme={webchatTheme}>
			<RatingWidget
				ratingTitleText={ratingTitleText}
				ratingCommentText={ratingCommentText}
				showRatingStatus={showRatingStatus}
				buttonText={buttonText}
				ratingEventBannerText={ratingEventBannerText}
				onSendRating={handleSendRating}
				selectedRating={selectedRating}
				selectedRatingComment={selectedRatingComment}
				isSimulation={isSimulation}
			/>
		</ThemeProvider>
	);
};

// Plugin for displaying rating requests (request-rating plugin type) for the simulator transcript
const ratingWidget: MessagePlugin = {
	match: message => { 
		 return message.data?._plugin?.type === "request-rating" && message.data?.isSimulation },
	component: RatingWidgetPlugin,
	options: {
		fullwidth: true,
	},
};

registerMessagePlugin(ratingWidget);

export default ratingWidget;
