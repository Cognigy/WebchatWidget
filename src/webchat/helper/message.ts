import { IMessage } from "../../common/interfaces/message";

const getTextFromMessage = (message: IMessage) => {
	// Check if message is plain text
	if (message?.text) {
		return message.text;
		// Check if message is quick reply message
	} else if (message?.data?._cognigy?._webchat?.message?.text) {
		return message.data._cognigy._webchat.message.text;
		// Check if message is button message
	} else if (
		message?.data?._cognigy?._webchat?.message?.attachment?.type === "template" &&
		message?.data?._cognigy?._webchat?.message?.attachment?.payload?.template_type === "button"
	) {
		return message.data._cognigy._webchat.message.attachment.payload.text;
	} else {
		return "";
	}
};

export const getMessageAttachmentType = (message: IMessage): string => {
	const isTextMessage = getTextFromMessage(message);
	if (isTextMessage) return "";

	return message?.data?._cognigy?._webchat?.message?.attachment?.type || "";
};

export const isQueueUpdate = (message: IMessage): boolean => {
	return !!(message?.data?._cognigy?._webchat3Event?.type === "queueUpdate");
};

export const isEventMessage = (message: IMessage): boolean => {
	return !!message?.data?._cognigy?._webchat3Event?.type;
};

export const getEventPayload = (message: IMessage): boolean => {
	return message?.data?._cognigy?._webchat3Event?.data;
};

export const getEventType = (message: IMessage): boolean => {
	return message?.data?._cognigy?._webchat3Event?.type;
};

export default getTextFromMessage;
