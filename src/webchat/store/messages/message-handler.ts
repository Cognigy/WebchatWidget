import { Store } from "redux";
import { IMessage } from "../../../common/interfaces/message";
import { ISendMessageOptions } from "./message-middleware";
import { setBotAvatarOverrideUrl, setUserAvatarOverrideUrl, setAgentAvatarOverrideUrl, setTyping } from "../ui/ui-reducer";
import { SocketClient } from "@cognigy/socket-client";
import { showRatingDialog } from "../rating/rating-reducer";

const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';
export const receiveMessage = (message: IMessage, options: Partial<ISendMessageOptions> = {}) => ({
    type: RECEIVE_MESSAGE as 'RECEIVE_MESSAGE',
    message: { ...message } as IMessage,
    options
});
export type ReceiveMessageAction = ReturnType<typeof receiveMessage>;

export const registerMessageHandler = (store: Store, client: SocketClient) => {
    client.on('output', output => {
        // handle custom webchat actions
        if (output.data && output.data._webchat) {
            const { agentAvatarOverrideUrl, botAvatarOverrideUrl, userAvatarOverrideUrl } = output.data._webchat;

            if (agentAvatarOverrideUrl !== undefined) {
                store.dispatch(setAgentAvatarOverrideUrl(agentAvatarOverrideUrl));
            }

            if (botAvatarOverrideUrl !== undefined) {
                store.dispatch(setBotAvatarOverrideUrl(botAvatarOverrideUrl));
            }
            
            if (userAvatarOverrideUrl !== undefined) {
                store.dispatch(setUserAvatarOverrideUrl(userAvatarOverrideUrl))
            }
        }

		// handle custom plugin actions
		if (output.data && output.data._plugin) {
			const { type } = output.data._plugin;

			if (type === "request-rating") {
				store.dispatch(showRatingDialog(true));
			};
		}

        store.dispatch(setTyping("remove"));
        store.dispatch(receiveMessage(output));
    });
}