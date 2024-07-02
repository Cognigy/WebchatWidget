import { Store } from "redux";
import { IMessage } from "../../../common/interfaces/message";
import { ISendMessageOptions } from "./message-middleware";
import {
	setBotAvatarOverrideUrl,
	setAgentAvatarOverrideUrl,
	setTyping,
} from "../ui/ui-reducer";
import {
	setCustomRatingCommentText,
	setCustomRatingTitle,
	setRequestRatingSubmitButtonText,
	setRequestRatingEventBannerText,
	setRequestRatingChatStatusText,
	showRatingScreen,
	setRequestRatingScreenTitle,
} from "../rating/rating-reducer";
import { SocketClient } from "@cognigy/socket-client";
import { getEventPayload, isEventMessage, isQueueUpdate } from "../../helper/message";
import { updateQueueData } from "../queue-updates/slice";
import { IMessageEvent } from "../../../common/interfaces/event";

const RECEIVE_MESSAGE = "RECEIVE_MESSAGE";
export const receiveMessage = (message: IMessage, options: Partial<ISendMessageOptions> = {}) => ({
	type: RECEIVE_MESSAGE as "RECEIVE_MESSAGE",
	message: { ...message } as IMessage,
	options,
});
export type ReceiveMessageAction = ReturnType<typeof receiveMessage>;

const RECEIVE_EVENT = "RECEIVE_EVENT";
export const receiveEvent = (event: IMessageEvent) => ({
	type: RECEIVE_EVENT as "RECEIVE_EVENT",
	event: { ...event } as IMessageEvent,
});
export type ReceiveEventAction = ReturnType<typeof receiveEvent>;

export const createOutputHandler = (store: Store) => output => {
	// handle custom webchat actions
	if (output.data && output.data._webchat) {
		const { agentAvatarOverrideUrl, botAvatarOverrideUrl } =
			output.data._webchat;

		if (agentAvatarOverrideUrl !== undefined) {
			store.dispatch(setAgentAvatarOverrideUrl(agentAvatarOverrideUrl));
		}

		if (botAvatarOverrideUrl !== undefined) {
			store.dispatch(setBotAvatarOverrideUrl(botAvatarOverrideUrl));
		}
	}

	// handle custom plugin actions
	if (output.data && output.data._plugin) {
		const { type, data } = output.data._plugin;

		if (type === "request-rating") {
			if (data && data.ratingCommentText) {
				store.dispatch(setCustomRatingCommentText(data.ratingCommentText));
			}

			if (data && data.ratingTitleText) {
				store.dispatch(setCustomRatingTitle(data.ratingTitleText));
			}

			if (data && data.ratingSubmitButtonText) {
				store.dispatch(setRequestRatingSubmitButtonText(data.ratingSubmitButtonText));
			}

			if (data && data.ratingEventBannerText) {
				store.dispatch(setRequestRatingEventBannerText(data.ratingEventBannerText));
			}

			if (data && data.ratingChatStatusMessage) {
				store.dispatch(setRequestRatingChatStatusText(data.ratingChatStatusMessage));
			}

			if (data && data.ratingScreenTitleText) {
				store.dispatch(setRequestRatingScreenTitle(data.ratingScreenTitleText));
			}

			store.dispatch(showRatingScreen(true));
		}
	}

	store.dispatch(setTyping("remove"));

	// we handle event Messages in a custom way
	if (isEventMessage(output?.data)) {
		const payload = getEventPayload(output?.data);
		if (isQueueUpdate(output?.data)) {
			store.dispatch(updateQueueData(payload));
		}
	} else {
		store.dispatch(receiveMessage(output));
	}
};

export const registerMessageHandler = (store: Store, client: SocketClient) => {
	client.on("output", createOutputHandler(store));
};
