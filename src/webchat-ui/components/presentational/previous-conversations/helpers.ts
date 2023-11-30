import moment from "moment";
import { IMessage } from "../../../../common/interfaces/message";
import getTextFromMessage, { getMessageAttachmentType } from "../../../../webchat/helper/message";
import { findReverse } from "../../../utils/find-reverse";
import { IWebchatConfig } from "../../../../common/interfaces/webchat-config";

export const getRelativeTime = (messages: IMessage[]) => {
	const lastMessage = messages[messages.length - 1];
	if (!lastMessage?.timestamp) return "";

	moment.relativeTimeThreshold("d", 6);
	moment.relativeTimeThreshold("w", 4);
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

export const getLastReadableMessageText = (messages: IMessage[]) => {
	const lastReadableMessage = findReverse(messages, message => !!getTextFromMessage(message));

	if (lastReadableMessage) {
		return getTextFromMessage(lastReadableMessage);
	}

	return "";
};

export const getLastMessagePreview = (messages: IMessage[]) => {
	const lastReadableMessageText = getLastReadableMessageText(messages);
	if (lastReadableMessageText) return lastReadableMessageText;

	// we don't have text messages in the chat
	// we need to find the last attachment type
	const lastMessage = messages[messages.length - 1];

	const attachmentType = getMessageAttachmentType(lastMessage);

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
	const hasBot = messages.some(message => message?.source === "bot");
	const hasLiveAgent = messages.some(message => message?.source === "agent");

	// TODO: get the correct names, if any, from the endpoint

	if (hasBot) partecipants.push(config?.settings?.title || "Bot");
	if (hasLiveAgent) partecipants.push("Live Agent");

	return partecipants.join(", ");
};
