import { Middleware, Store } from "redux";
import { StoreState } from "../store";
import { IMessage, IBotMessage } from "../../../common/interfaces/message";
import { addMessage } from "./message-reducer";
import { Omit } from "react-redux";
import { setFullscreenMessage } from "../ui/ui-reducer";
import { SetConfigAction } from "../config/config-reducer";
import { ReceiveMessageAction } from "./message-handler";
import { sanitizeHTML } from "../../helper/sanitize";
import { SocketClient } from "@cognigy/socket-client";


// a "person" icon
const defaultAgentAvatar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAACOklEQVR4Ae3ZA2ydURwF8P9s2+bjPSdGo0aN08V+URtbL+a8BbO9xfZs2zaCuW7vbDx8uLfp/3dinw+XopRSSimllFJhYm9TjV08wwdoYB0f8ix2mDkTe0p7YIZxDeto/5I6rjHDxGtdkcc72n8H75CXruKn1CAcpi0cHE4NEv9kp+EubXHB3ew08QuH4hFt8cGj5Ajxx9hePE1bYi6k+4gvMJ+29GCe+CEzhvW0ZaQ+PVZ8wDW0ZWatuJfozrqyC9Qluotr2Sra8pOtEtewMkgBrBLXsC9QgX3iGm4EKnBDXOP7QAXeiWt4G6jAW3ENNwMVuCmu4UCgAgc6/DCqE1miO9+7X0oEgtVlF1gjPkiOKHs5Pbx9b2jme7SlxPmSC5we20v8kRjJh6Vt6jlU/JKZztsBj1XcH2zxGG3h4ERqkPgp0R35AhvMOuQT3cVnyRH/O9wt4zjLzaj00/F6/dfj9WrPj9eVUkqpRPeMMTnMxxbu4fWf5uP3uME93IZ5JpcxHi4lzGjWYgPPsom2cNDIs9jAWjNaXJvaw1RyES/SlpmLXGQqHb0Rgsv5hjaEvOJyIt6lWg4nacMNTppcHMu9LqYGL2ijCZ6bGuki0TEVuEIbbXDFVEgU2JsbaWPKRvYOf6C8SBtjLoY6yKbH4h5tvMHd5DgJR6Ivb9E6yK1EX6c3AMGDlRIcZtG6i5ktQWGpywJYKkHxgtMC5yUo1tM6TL0ERes2WkALaAEtEEm0gFJKKaWUUkp9ABvn3SEbw3cFAAAAAElFTkSuQmCC";

// the cognigy work mark
const defaultBotAvatar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABnCAYAAABCfBH1AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHiSURBVHic7dVLqE1RGAfwn8vAvQYGipKMGHmUgaQIxcRAKSaiRAbyGCgDjzIyNDJS8iylpLzKRCEReXSjyCOvEgPOzR3hugzWks09p6Qk+f9qtff+zv72+ta3V/sQERERERERERERERERERERERH/l+m4jieNsRddOIBXeIfn2F5zluBBjX8bW7CpxsfX+6bgHrrxBiOxHA9/yl2Pw1jVqGtNnX+IER0WsrkWuQFfaqyFGViKRXWyWTiKPdiJEzjYyHmHdZiI05iH4RiNYRhbj7twBMcaNbzFXExuxCbV+3/ZcaxtE1+A2z/FBjAG9zGzEZ+jLHxrXdwpnK2xl+hRFtytNG1KI3c+pmEZPuJFzfmgvPkhujosZLBO0C4+qnHdU58xWEdP47cVWFzPP2MlJmB3h+c2c1djofKGx+G80oRxypsdotPWuocdSvcGauwWzijb5BReY6rSzRbuYh8uK52e48et0l8Xdr3NfHdxCFfq9Wz01vMW+pRm9HWo1/AO8Wu1wMH6oFa9vul7R/pxA9vwXunaW3yq9/fiIp7iGR7XnAvKVrlRC7uKczXnYz3ewSXlo0Jp5qNaQ0T8hmFTN55s+0/5rxmhq2v/3y4iIiIiIiIiIiIiIiIiIiIiIiL+gK+UDHbPIL89gwAAAABJRU5ErkJggg=="

// a "person" icon
const defaultUserAvatar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAACOklEQVR4Ae3ZA2ydURwF8P9s2+bjPSdGo0aN08V+URtbL+a8BbO9xfZs2zaCuW7vbDx8uLfp/3dinw+XopRSSimllFJhYm9TjV08wwdoYB0f8ix2mDkTe0p7YIZxDeto/5I6rjHDxGtdkcc72n8H75CXruKn1CAcpi0cHE4NEv9kp+EubXHB3ew08QuH4hFt8cGj5Ajxx9hePE1bYi6k+4gvMJ+29GCe+CEzhvW0ZaQ+PVZ8wDW0ZWatuJfozrqyC9Qluotr2Sra8pOtEtewMkgBrBLXsC9QgX3iGm4EKnBDXOP7QAXeiWt4G6jAW3ENNwMVuCmu4UCgAgc6/DCqE1miO9+7X0oEgtVlF1gjPkiOKHs5Pbx9b2jme7SlxPmSC5we20v8kRjJh6Vt6jlU/JKZztsBj1XcH2zxGG3h4ERqkPgp0R35AhvMOuQT3cVnyRH/O9wt4zjLzaj00/F6/dfj9WrPj9eVUkqpRPeMMTnMxxbu4fWf5uP3uME93IZ5JpcxHi4lzGjWYgPPsom2cNDIs9jAWjNaXJvaw1RyES/SlpmLXGQqHb0Rgsv5hjaEvOJyIt6lWg4nacMNTppcHMu9LqYGL2ijCZ6bGuki0TEVuEIbbXDFVEgU2JsbaWPKRvYOf6C8SBtjLoY6yKbH4h5tvMHd5DgJR6Ivb9E6yK1EX6c3AMGDlRIcZtG6i5ktQWGpywJYKkHxgtMC5yUo1tM6TL0ERes2WkALaAEtEEm0gFJKKaWUUkp9ABvn3SEbw3cFAAAAAElFTkSuQmCC"

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

const getAvatarForMessage = (message: IMessage, state: StoreState) => {
    switch (message.source) {
        case 'agent':
            return state.ui.agentAvatarOverrideUrl || state.config.settings.agentAvatarUrl || defaultAgentAvatar;
        case 'bot':
            return state.ui.botAvatarOverrideUrl || state.config.settings.messageLogoUrl || defaultBotAvatar;
        case 'user':
            return state.ui.userAvatarOverrideUrl || state.config.settings.userAvatarUrl || defaultUserAvatar;
    }
}

// forwards messages to the socket
export const createMessageMiddleware = (client: SocketClient): Middleware<{}, StoreState> => store => next => (action: SendMessageAction | ReceiveMessageAction | SetConfigAction) => {
    switch (action.type) {
        case 'SEND_MESSAGE': {
            const { message, options } = action;
            let { text, data } = message;

            if (!store.getState().config.settings.disableTextInputSanitization) {
                text = sanitizeHTML(text || '');
            }

            client.sendMessage(text || '', data);

            const displayMessage = { ...message, text };

            if (options.label)
                displayMessage.text = options.label;

            next(setFullscreenMessage(undefined));
            return next(addMessage({
                ...displayMessage,
                avatarUrl: getAvatarForMessage(displayMessage, store.getState())
            }));
        }

        case 'RECEIVE_MESSAGE': {
            const { message } = action;
            
            const avatarUrl = getAvatarForMessage(message, store.getState());

            return next(addMessage({
                ...message,
                source: 'bot',
                avatarUrl
            } as IBotMessage));
        }

        case 'SET_CONFIG': {
            const config = action.config;

            if (config && store.getState().messages.length === 0) {
                const isInjectBehavior = config.settings.startBehavior === 'injection';

                if (isInjectBehavior) {
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
