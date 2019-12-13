import { Store } from "redux";
import { setTyping } from "../ui/ui-reducer";
import { SocketClient } from "@cognigy/socket-client";


export const registerTypingHandler = (store: Store, client: SocketClient) => {
    client.on('typingStatus', payload => {
        try {
            const typing = payload.status === 'typingOn';
            store.dispatch(setTyping(typing));
        } catch (e) {}
    });
}