import { Middleware } from "redux";
import { StoreState } from "../store";
import { IMessage, IBotMessage } from "../../../common/interfaces/message";
import { addMessage } from "./message-reducer";
import { Omit } from "react-redux";
import { setFullscreenMessage } from "../ui/ui-reducer";
import { receiveMessage, ReceiveMessageAction } from "./message-handler";
import { sanitizeHTML } from "../../helper/sanitize";
import { SocketClient } from "@cognigy/socket-client";


// a "person" icon
const defaultAgentAvatar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAACOklEQVR4Ae3ZA2ydURwF8P9s2+bjPSdGo0aN08V+URtbL+a8BbO9xfZs2zaCuW7vbDx8uLfp/3dinw+XopRSSimllFJhYm9TjV08wwdoYB0f8ix2mDkTe0p7YIZxDeto/5I6rjHDxGtdkcc72n8H75CXruKn1CAcpi0cHE4NEv9kp+EubXHB3ew08QuH4hFt8cGj5Ajxx9hePE1bYi6k+4gvMJ+29GCe+CEzhvW0ZaQ+PVZ8wDW0ZWatuJfozrqyC9Qluotr2Sra8pOtEtewMkgBrBLXsC9QgX3iGm4EKnBDXOP7QAXeiWt4G6jAW3ENNwMVuCmu4UCgAgc6/DCqE1miO9+7X0oEgtVlF1gjPkiOKHs5Pbx9b2jme7SlxPmSC5we20v8kRjJh6Vt6jlU/JKZztsBj1XcH2zxGG3h4ERqkPgp0R35AhvMOuQT3cVnyRH/O9wt4zjLzaj00/F6/dfj9WrPj9eVUkqpRPeMMTnMxxbu4fWf5uP3uME93IZ5JpcxHi4lzGjWYgPPsom2cNDIs9jAWjNaXJvaw1RyES/SlpmLXGQqHb0Rgsv5hjaEvOJyIt6lWg4nacMNTppcHMu9LqYGL2ijCZ6bGuki0TEVuEIbbXDFVEgU2JsbaWPKRvYOf6C8SBtjLoY6yKbH4h5tvMHd5DgJR6Ivb9E6yK1EX6c3AMGDlRIcZtG6i5ktQWGpywJYKkHxgtMC5yUo1tM6TL0ERes2WkALaAEtEEm0gFJKKaWUUkp9ABvn3SEbw3cFAAAAAElFTkSuQmCC";

// "white-label friendly" grey background
const defaultBotAvatar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKIAAACiCAYAAADC8hYbAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAclJREFUeJzt0jEBwDAMwLCs/FGGyAqjPiQEPvzt7j/w2HkdADNGJMKIJBiRBCOSYEQSjEiCEUkwIglGJMGIJBiRBCOSYEQSjEiCEUkwIglGJMGIJBiRBCOSYEQSjEiCEUkwIglGJMGIJBiRBCOSYEQSjEiCEUkwIglGJMGIJBiRBCOSYEQSjEiCEUkwIglGJMGIJBiRBCOSYEQSjEiCEUkwIglGJMGIJBiRBCOSYEQSjEiCEUkwIglGJMGIJBiRBCOSYEQSjEiCEUkwIglGJMGIJBiRBCOSYEQSjEiCEUkwIglGJMGIJBiRBCOSYEQSjEiCEUkwIglGJMGIJBiRBCOSYEQSjEiCEUkwIglGJMGIJBiRBCOSYEQSjEiCEUkwIglGJMGIJBiRBCOSYEQSjEiCEUkwIglGJMGIJBiRBCOSYEQSjEiCEUkwIglGJMGIJBiRBCOSYEQSjEiCEUkwIglGJMGIJBiRBCOSYEQSjEiCEUkwIglGJMGIJBiRBCOSYEQSjEiCEUkwIglGJMGIJBiRBCOSYEQSjEiCEUkwIglGJMGIJBiRBCOSYEQSjEiCEUkwIglGJMGIJBiRBCOSYEQSjEiCEUkwIgkXp8oE6Yb9phEAAAAASUVORK5CYII="

// a "person" icon
const defaultUserAvatar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAACOklEQVR4Ae3ZA2ydURwF8P9s2+bjPSdGo0aN08V+URtbL+a8BbO9xfZs2zaCuW7vbDx8uLfp/3dinw+XopRSSimllFJhYm9TjV08wwdoYB0f8ix2mDkTe0p7YIZxDeto/5I6rjHDxGtdkcc72n8H75CXruKn1CAcpi0cHE4NEv9kp+EubXHB3ew08QuH4hFt8cGj5Ajxx9hePE1bYi6k+4gvMJ+29GCe+CEzhvW0ZaQ+PVZ8wDW0ZWatuJfozrqyC9Qluotr2Sra8pOtEtewMkgBrBLXsC9QgX3iGm4EKnBDXOP7QAXeiWt4G6jAW3ENNwMVuCmu4UCgAgc6/DCqE1miO9+7X0oEgtVlF1gjPkiOKHs5Pbx9b2jme7SlxPmSC5we20v8kRjJh6Vt6jlU/JKZztsBj1XcH2zxGG3h4ERqkPgp0R35AhvMOuQT3cVnyRH/O9wt4zjLzaj00/F6/dfj9WrPj9eVUkqpRPeMMTnMxxbu4fWf5uP3uME93IZ5JpcxHi4lzGjWYgPPsom2cNDIs9jAWjNaXJvaw1RyES/SlpmLXGQqHb0Rgsv5hjaEvOJyIt6lWg4nacMNTppcHMu9LqYGL2ijCZ6bGuki0TEVuEIbbXDFVEgU2JsbaWPKRvYOf6C8SBtjLoY6yKbH4h5tvMHd5DgJR6Ivb9E6yK1EX6c3AMGDlRIcZtG6i5ktQWGpywJYKkHxgtMC5yUo1tM6TL0ERes2WkALaAEtEEm0gFJKKaWUUkp9ABvn3SEbw3cFAAAAAElFTkSuQmCC"

export interface ISendMessageOptions {
    /** overrides the displayed text within a chat bubble. useful for e.g. buttons */
    label: string;

    /** marks this message as "collatable", delaying its submission for the enableInputCollation functionality */
    collate: boolean;
}

const SEND_MESSAGE = 'SEND_MESSAGE';
export const sendMessage = (message: Omit<IMessage, 'source'>, options: Partial<ISendMessageOptions> = {}) => ({
    type: SEND_MESSAGE as 'SEND_MESSAGE',
    message: { ...message, source: 'user' } as IMessage,
    options
});
export type SendMessageAction = ReturnType<typeof sendMessage>;

const TRIGGER_ENGAGEMENT_MESSAGE = 'TRIGGER_ENGAGEMENT_MESSAGE';
export const triggerEngagementMessage = () => ({
    type: TRIGGER_ENGAGEMENT_MESSAGE as 'TRIGGER_ENGAGEMENT_MESSAGE'
});
type TriggerEngagementMessageAction = ReturnType<typeof triggerEngagementMessage>;

export const getAvatarForMessage = (message: IMessage, state: StoreState) => {
    switch (message.source) {
        case 'agent':
            return state.ui.agentAvatarOverrideUrl || state.config.settings.agentAvatarUrl || defaultAgentAvatar;
        case 'bot':
        case 'engagement':
            return state.ui.botAvatarOverrideUrl || state.config.settings.messageLogoUrl || defaultBotAvatar;
        case 'user':
            return state.ui.userAvatarOverrideUrl || state.config.settings.userAvatarUrl || defaultUserAvatar;
    }
}

// forwards messages to the socket
export const createMessageMiddleware = (client: SocketClient): Middleware<{}, StoreState> => store => next => (action: SendMessageAction | ReceiveMessageAction | TriggerEngagementMessageAction) => {
    switch (action.type) {
        case 'SEND_MESSAGE': {
            const { message, options } = action;
            let { text, data } = message;

            if (!store.getState().config.settings.disableTextInputSanitization) {
                text = sanitizeHTML(text || '');
            }

            if (store.getState().config.settings.disableHtmlInput) {
                text = new DOMParser()
                    .parseFromString(text || '', 'text/html')
                    .body
                    .textContent || '';
            }

            client.sendMessage(text || '', data);

            const displayMessage = { ...message, text };

            if (typeof options.label === 'string')
                displayMessage.text = options.label;

            next(setFullscreenMessage(undefined));

            next(addMessage({
                ...displayMessage,
                avatarUrl: getAvatarForMessage(displayMessage, store.getState())
            }));

            break;
        }

        case 'RECEIVE_MESSAGE': {
            const state = store.getState();
            const { message } = action;
            const avatarUrl = getAvatarForMessage(message, state);

            const isWebchatActive = state.ui.open && state.ui.isPageVisible;
            const isMessageEmpty = !(message.text || message.data?._cognigy?._webchat);
            const isUnseen = !isWebchatActive && !isMessageEmpty;

            next(addMessage({
                ...message,
                source: message.source || 'bot',
                avatarUrl
            } as IBotMessage, isUnseen));

            break;
        }

        case 'TRIGGER_ENGAGEMENT_MESSAGE': {
            const text = store.getState().config.settings.engagementMessageText;

            if (text) {
                store.dispatch(receiveMessage({
                    source: 'engagement',
                    traceId: `engagement-${Math.random()}`,
                    text
                }));
            }

            break;
        }
    }

    return next(action);
}
