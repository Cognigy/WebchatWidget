import { Store } from "redux";
import { WebchatClient } from "@cognigy/webchat-client";
import { addMessage } from "./message-reducer";
import { IMessage } from "../../../common/interfaces/message";
import { ISendMessageOptions } from "./message-middleware";

const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';
export const receiveMessage = (message: IMessage, options: Partial<ISendMessageOptions> = {}) => ({
    type: RECEIVE_MESSAGE as 'RECEIVE_MESSAGE',
    message: { ...message } as IMessage,
    options
});
export type ReceiveMessageAction = ReturnType<typeof receiveMessage>;

export const registerMessageHandler = (store: Store, client: WebchatClient) => {
    client.on('output', output => store.dispatch(receiveMessage({ ...output, source: 'bot' })));
}