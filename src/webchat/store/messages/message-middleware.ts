import { Middleware } from "redux";
import { StoreState } from "../store";
import { IMessage, IBotMessage } from "../../../common/interfaces/message";
import { addMessage, addMessageEvent } from "./message-reducer";
import { Omit } from "react-redux";
import { setFullscreenMessage } from "../ui/ui-reducer";
import { receiveMessage, ReceiveMessageAction } from "./message-handler";
import { sanitizeHTML } from "../../helper/sanitize";
import { SocketClient } from "@cognigy/socket-client";
import { IMessageEvent } from "../../../common/interfaces/event";
import bellSound from "../../../webchat-ui/utils/bell-sound";


// a "person" icon
const defaultAgentAvatar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAACOklEQVR4Ae3ZA2ydURwF8P9s2+bjPSdGo0aN08V+URtbL+a8BbO9xfZs2zaCuW7vbDx8uLfp/3dinw+XopRSSimllFJhYm9TjV08wwdoYB0f8ix2mDkTe0p7YIZxDeto/5I6rjHDxGtdkcc72n8H75CXruKn1CAcpi0cHE4NEv9kp+EubXHB3ew08QuH4hFt8cGj5Ajxx9hePE1bYi6k+4gvMJ+29GCe+CEzhvW0ZaQ+PVZ8wDW0ZWatuJfozrqyC9Qluotr2Sra8pOtEtewMkgBrBLXsC9QgX3iGm4EKnBDXOP7QAXeiWt4G6jAW3ENNwMVuCmu4UCgAgc6/DCqE1miO9+7X0oEgtVlF1gjPkiOKHs5Pbx9b2jme7SlxPmSC5we20v8kRjJh6Vt6jlU/JKZztsBj1XcH2zxGG3h4ERqkPgp0R35AhvMOuQT3cVnyRH/O9wt4zjLzaj00/F6/dfj9WrPj9eVUkqpRPeMMTnMxxbu4fWf5uP3uME93IZ5JpcxHi4lzGjWYgPPsom2cNDIs9jAWjNaXJvaw1RyES/SlpmLXGQqHb0Rgsv5hjaEvOJyIt6lWg4nacMNTppcHMu9LqYGL2ijCZ6bGuki0TEVuEIbbXDFVEgU2JsbaWPKRvYOf6C8SBtjLoY6yKbH4h5tvMHd5DgJR6Ivb9E6yK1EX6c3AMGDlRIcZtG6i5ktQWGpywJYKkHxgtMC5yUo1tM6TL0ERes2WkALaAEtEEm0gFJKKaWUUkp9ABvn3SEbw3cFAAAAAElFTkSuQmCC";

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
export type TriggerEngagementMessageAction = ReturnType<typeof triggerEngagementMessage>;

export const getAvatarForMessage = (message: IMessage, state: StoreState) => {
    switch (message.source) {
        case 'agent':
            return state.ui.agentAvatarOverrideUrl || (state.config.settings.layout.useOtherAgentLogo && state.config.settings.layout.agentLogoUrl) || state.config.settings.layout.logoUrl || defaultAgentAvatar;
        case 'bot':
        case 'engagement':
            return state.ui.botAvatarOverrideUrl || (state.config.settings.layout.useOtherAgentLogo && state.config.settings.layout.botLogoUrl) || state.config.settings.layout.logoUrl || undefined;
        case 'user':
            return;
    }
}

export const getAvatarNameForMessage = (message: IMessage, state: StoreState) => {
    switch (message.source) {
        case 'agent':
            return (state.config.settings.layout.useOtherAgentLogo && state.config.settings.layout.agentAvatarName) || state.config.settings.layout.title || undefined;
        case 'bot':
        case 'engagement':
            return (state.config.settings.layout.useOtherAgentLogo && state.config.settings.layout.botAvatarName) || state.config.settings.layout.title || undefined;
        case 'user':
            return;
    }
}

export const getTextForMessageEvent = (state: StoreState, action: string) => {
    const agentName = (state.config.settings.layout.useOtherAgentLogo && state.config.settings.layout.agentAvatarName) || state.config.settings.layout.title || "Agent";
    return `${agentName} ${action}`;
}

// forwards messages to the socket
export const createMessageMiddleware = (client: SocketClient): Middleware<object, StoreState> => store => next => (action: SendMessageAction | ReceiveMessageAction | TriggerEngagementMessageAction) => {
    switch (action.type) {
        case 'SEND_MESSAGE': {
            const { message, options } = action;
            let { text, data } = message;

            if (!store.getState().config.settings.widgetSettings.disableTextInputSanitization) {
                text = sanitizeHTML(text || '');
            }

            if (store.getState().config.settings.widgetSettings.disableHtmlInput) {
                text = new DOMParser()
                    .parseFromString(text || '', 'text/html')
                    .body
                    .textContent || '';
            }

            // data is either a non-empty object or null
            data = (data && typeof data === 'object' && Object.keys(data).length > 0)
                ? data
                : null;

            // don't send empty messages!
            if (!text && !data)
                break;

            client.sendMessage(text || '', data);

            const displayMessage = { ...message, text };

            if (typeof options.label === 'string')
                displayMessage.text = options.label;

            next(setFullscreenMessage(undefined));

            next(addMessage({
                ...displayMessage,
                avatarUrl: getAvatarForMessage(displayMessage, store.getState()),
                avatarName: getAvatarNameForMessage(displayMessage, store.getState()),
                timestamp: Date.now(),
            }));

            break;
        }

        case 'RECEIVE_MESSAGE': {
            const state = store.getState();
            const { message } = action;
            const avatarUrl = getAvatarForMessage(message, state);
            const avatarName = getAvatarNameForMessage(message, state);

            const isWebchatActive = state.ui.open && state.ui.isPageVisible;
            const isMessageEmpty = !(message.text || message.data?._cognigy?._webchat);
            const isUnseen = !isWebchatActive && !isMessageEmpty;

            // temporary solution: conditionally inject a event message type
            // we should get this kind of status updates from socket output event
            if (message.source === "agent" && state.queueUpdates.isQueueActive) {
                const eventMessage: IMessageEvent = {
                    text: "",
                    data: {
                        _cognigy: {
                            _webchat3: {
                                type: 'liveAgentEvent',
                                payload: {
                                    text: getTextForMessageEvent(state, "joined")
                                }
                            }
                        }
                    }
                }
                next(addMessageEvent(eventMessage));
                bellSound.play();
            }

            next(addMessage({
                ...message,
                source: message.source || 'bot',
                timestamp: Date.now(),
                avatarUrl,
                avatarName,
            } as IBotMessage, isUnseen));

            break;
        }

        case 'TRIGGER_ENGAGEMENT_MESSAGE': {
            const text = store.getState().config.settings.teaserMessage.text;

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
