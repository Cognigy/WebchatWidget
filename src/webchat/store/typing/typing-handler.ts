import { WebchatClient } from "@cognigy/webchat-client";
import { Store } from "redux";
import { setTyping } from "../ui/ui-reducer";


export const registerTypingHandler = (store: Store, client: WebchatClient) => {
    client.on('typingStatus', payload => {
        try {
            const typing = payload.status === 'typingOn';
            store.dispatch(setTyping(typing));
        } catch (e) {}
    });
}