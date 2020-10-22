import { IMessage } from "../../common/interfaces/message"

const getTextFromMessage = (message: IMessage) => {

    // Check if message is plain text
    if (message.text !== null) {
        return message.text;
    
        // Check if message is quick reply message
    } else if (message?.data?._cognigy?._webchat?.message?.text) {
        return message.data._cognigy._webchat.message.text;
    }
}

export default getTextFromMessage;