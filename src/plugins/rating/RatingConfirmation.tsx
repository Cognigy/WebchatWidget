import React from "react";
import { ChatEvent } from "@cognigy/chat-components";
import { useSelector } from "react-redux";
import { StoreState } from "../../webchat/store/store";

const RatingConfirmation = () => {
	const requestRatingChatStatusBadgeText = useSelector(
		(state: StoreState) => state.rating.requestRatingChatStatusBadgeText,
	);

	return <ChatEvent text={requestRatingChatStatusBadgeText || "Feedback submitted"} />;
};

export default RatingConfirmation;
