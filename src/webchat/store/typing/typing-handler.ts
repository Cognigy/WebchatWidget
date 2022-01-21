import { Store } from "redux";
import { setTyping } from "../ui/ui-reducer";
import { SocketClient } from "@cognigy/socket-client";


export const registerTypingHandler = (store: Store, client: SocketClient) => {
    client.on('typingStatus', payload => {
        try {
            const typingOn = payload.status === 'typingOn';
            const oldValue = store.getState().ui.typing;
            /*
            * Dispatch setTyping('show') if we received `typingOn` or the old value was 'show', 
            * otherwise skip. This way we can ignore double typingOff events {we do
            * setTyping('remove') on the 'output' event, e.g. on receiving regular message}
            */
            const typingStatus = typingOn ? 'show' : oldValue === 'show' ? 'hide' : null;
            if (typingStatus) {
                store.dispatch(setTyping(typingStatus));
            }
        } catch (e) {
            console.warn("Unable to update typing status");
        }
    });
}