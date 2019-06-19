import { Middleware } from "redux";
import { StoreState } from "../store";
import { IMessage } from "../../../common/interfaces/message";
import { WebchatClient } from '@cognigy/webchat-client';
import { addMessage } from "./message-reducer";
import { Omit } from "react-redux";
import { setFullscreenMessage } from "../ui/ui-reducer";
import { SetConfigAction } from "../config/config-reducer";
import { connect } from "../connection/connection-middleware";

export interface ISendMessageOptions {
    /* overrides the displayed text within a chat bubble. useful for e.g. buttons */
    label: string;
}

const SEND_MESSAGE = 'SEND_MESSAGE';
export const sendMessage = (message: Omit<IMessage, 'source'>, options: Partial<ISendMessageOptions> = {}) => ({
    type: SEND_MESSAGE as 'SEND_MESSAGE',
    message: { ...message, source: 'user' } as IMessage,
    options
});
export type SendMessageAction = ReturnType<typeof sendMessage>;

// forwards messages to the socket
export const createMessageMiddleware = (client: WebchatClient): Middleware<{}, StoreState> => store => next => (action: SendMessageAction | SetConfigAction) => {
    switch (action.type) {
        case 'SEND_MESSAGE': {
            const { message, options } = action;
            const { text, data } = message;

            client.sendMessage(text || '', data);

            const displayMessage = { ...message };

            if (options.label)
                displayMessage.text = options.label;

            next(setFullscreenMessage(undefined));
            return next(addMessage(displayMessage));
        }

        case 'SET_CONFIG': {
            const config = action.config;

            if (config && store.getState().messages.length === 0) {
                const isInjectBehavior = config.settings.startBehavior === 'injection';

                if (isInjectBehavior) {
                    store.dispatch(connect());
                    const text = config.settings.getStartedPayload;
                    const label = config.settings.getStartedText;
                    
                    client.sendMessage(text);
                    next(addMessage({ text: label, source: 'user' }))
                }
            }
            break;
        }
    }

    return next(action);
}