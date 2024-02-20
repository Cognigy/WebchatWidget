import moment from "moment";
import { IMessage } from "../../../../common/interfaces/message";
import getTextFromMessage, { getMessageAttachmentType } from "../../../../webchat/helper/message";
import { findReverse } from "../../../utils/find-reverse";
import { IWebchatConfig } from "../../../../common/interfaces/webchat-config";
import { PrevConversationsState } from "../../../../webchat/store/previous-conversations/previous-conversations-reducer";

export const getRelativeTime = (messages: IMessage[]) => {
	const lastMessage = messages[messages.length - 1];
	if (!lastMessage?.timestamp) return "";

	moment.relativeTimeThreshold("d", 6);
	moment.relativeTimeThreshold("w", 4); // we need to enable week Threshold
	moment.updateLocale("en", {
		relativeTime: {
			past: "%s",
			s: "Today",
			m: "Today",
			mm: "Today",
			h: "Today",
			hh: "Today",
			d: "Yesterday",
			dd: "%d days ago",
			w: "1 week ago",
			ww: "%d weeks ago",
			M: "1 month ago",
			MM: "%d months ago",
			y: "years",
			yy: "years",
		},
	});

	const relativeTime = moment(lastMessage.timestamp);

	if (relativeTime.fromNow() === "years") {
		return relativeTime.format("MMMM YYYY");
	}

	return relativeTime.fromNow();
};

export const getLastMessagePreview = (messages: IMessage[]) => {
	const lastReadableMessage = findReverse(messages, message => !!getTextFromMessage(message));
	if (lastReadableMessage) {
		return getTextFromMessage(lastReadableMessage);
	}

	// we don't have text messages in the chat
	// we need to find the last attachment type
	const lastMessage = messages[messages.length - 1];

	const attachmentType = getMessageAttachmentType(lastMessage);

	// TODO: implement icons here
	switch (attachmentType) {
		case "template":
			return "template...";
		case "image":
			return "image...";
		case "video":
			return "video...";
		case "audio":
			return "audio...";
		default:
			return "...";
	}
};

export const getParticipants = (messages: IMessage[], config: IWebchatConfig) => {
	const partecipants: string[] = [];
	const hasBot = messages.some(message => ["bot", "engagement"].includes(message?.source));
	const hasLiveAgent = messages.some(message => message?.source === "agent");

	// TODO: get the correct names, if any, from the endpoint
	if (hasBot) partecipants.push(config?.settings?.layout?.title || "Bot");
	if (hasLiveAgent) partecipants.push("Agent");

	if (!hasBot && !hasLiveAgent) return "You";

	return partecipants.join(", ");
};

export const getAvatars = (messages: IMessage[]) => {
	const notUserMessages = messages.filter(message => message?.source !== "user");

	const uniqueAvatars = [...new Set(notUserMessages.map(item => item?.avatarUrl))];
	return uniqueAvatars;
};

export const sortConversationsByFreshness = (conversations: PrevConversationsState) => {
	const sortedConversations: PrevConversationsState = Object.entries(conversations)
		.sort(
			([, a], [, b]) =>
				(b.messages[b.messages.length - 1]?.timestamp || 0) -
				(a.messages[a.messages.length - 1]?.timestamp || 0),
		)
		.reduce(
			(r, [k, v]) => ({
				...r,
				[k]: v,
			}),
			{},
		);
	return sortedConversations;
};

export const isConversationEnded = (messages: IMessage[]) => {
	if (!Array.isArray(messages) || messages.length === 0) {
		return false;
	}
	// TODO: get expiration time from the endpoint (pending from coming v3)
	const EXPIRATION_DAYS_LIMIT = 30;
	const lastMessageTimestamp = messages[messages.length - 1]?.timestamp || Date.now();
	const daysDifference = moment().diff(lastMessageTimestamp, "days");
	if (daysDifference >= EXPIRATION_DAYS_LIMIT) return true;
	return false;
};
