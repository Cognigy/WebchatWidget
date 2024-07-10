import { IMessage } from "../../common/interfaces/message";

const getMessagesListWithoutPrivacyMessage = (messages: IMessage[]) => {
    return messages.filter(message => {
        if (message.data?._cognigy && (message.data._cognigy as any).controlCommands) {
            return !(message.data._cognigy as any).controlCommands.some((controlCommand: any) => controlCommand.type === 'acceptPrivacyPolicy');
        }
        return true;
    });
}

export default getMessagesListWithoutPrivacyMessage;