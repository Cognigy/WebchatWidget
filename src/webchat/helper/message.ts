import { IMessage } from "../../common/interfaces/message";

const getTextFromMessage = (message: IMessage) => {
  // Check if message is plain text
  if (message.text) {
    return message.text;
    // Check if message is quick reply message
  } else if (message?.data?._cognigy?._webchat?.message?.text) {
    return message.data._cognigy._webchat.message.text;
    // Check if message is button message
  } else if (
    message?.data?._cognigy?._webchat?.message?.attachment?.type ===
      "template" &&
    message?.data?._cognigy?._webchat?.message?.attachment?.payload
      ?.template_type === "button"
  ) {
    return message.data._cognigy._webchat.message.attachment.payload.text;
  } else {
    return "";
  }
};

export default getTextFromMessage;
