import { Middleware } from "redux";
import { StoreState } from "../store";
import { SetHasAcceptedTermsAction, SetOpenAction, SetPageVisibleAction, ToggleOpenAction, setStoredMessage } from "../ui/ui-reducer";
import { SendMessageAction, sendMessage } from "../messages/message-middleware";
import { setOptions } from "../options/options-reducer";
import { SocketClient } from "@cognigy/socket-client";
import { setConnecting, setReconnectionLimit } from "./connection-reducer";
import { shouldReestablishConnection } from "../../helper/connection-watchdog";

export interface ISendMessageOptions {
    /* overrides the displayed text within a chat bubble. useful for e.g. buttons */
    label: string;
}

const CONNECT = 'CONNECT'
export const connect = (termsAccepted?: boolean) => ({
    type: CONNECT as 'CONNECT',
    termsAccepted
});
export type ConnectAction = ReturnType<typeof connect>;

const NETWORK_ON = 'NETWORK_ON';
export const announceNetworkOn = () => ({ type: NETWORK_ON as 'NETWORK_ON' })
type announceNetworkOnAction = ReturnType<typeof announceNetworkOn>;


// forwards messages to the socket
export const createConnectionMiddleware = (client: SocketClient): Middleware<object, StoreState> => store => next => (action: SetOpenAction | ToggleOpenAction | ConnectAction | SetHasAcceptedTermsAction | SendMessageAction | SetPageVisibleAction | announceNetworkOnAction) => {
    switch (action.type) {
        case 'CONNECT': {
            const { hasAcceptedTerms, storedMessage } = store.getState().ui;

            if (!client.connected && !store.getState().connection.connecting && (hasAcceptedTerms || action.termsAccepted)) {
                store.dispatch(setConnecting(true));
                
                client.connect()
                .then(() => {
                    // set options
                    store.dispatch(setConnecting(false));
                    store.dispatch(setReconnectionLimit(false))
                    store.dispatch(setOptions(client.socketOptions));

                    if (storedMessage) {
                        store.dispatch(sendMessage({ text: storedMessage.text, data: storedMessage.data }, storedMessage.options));
                        store.dispatch(setStoredMessage(null));
                    }
                    }).catch(error => {
                        store.dispatch(setConnecting(false));
                    })
            }
            break;
        }

        case 'SET_OPEN': {
            if (action.open) {
                if (!client.connected) {
                    store.dispatch(connect())
                }
            }

            break;
        }

        case 'SET_HAS_ACCEPTED_TERMS': {
            if (!client.connected) {
                store.dispatch(connect(true))
            }

            break;
        }

        case 'SEND_MESSAGE': {
            store.dispatch(connect())

            break;
        }

        case 'SET_PAGE_VISIBLE': {
            if (action.visible && shouldReestablishConnection(store.getState())) {
                store.dispatch(connect());
            }

            break;
        }

        case 'NETWORK_ON': {
            if (shouldReestablishConnection(store.getState())) {
                store.dispatch(connect());
            }

            break;
        }
    }

    return next(action);
}