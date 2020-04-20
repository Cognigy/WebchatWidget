import { Store } from "redux";
import { setConnected, setReconnectionLimit } from "./connection-reducer";
import { SocketClient } from "@cognigy/socket-client";

export const registerConnectionHandler = (store: Store, client: SocketClient) => {
    client.on('socket/connect', () => { store.dispatch(setConnected(true)) });
    client.on('socket/reconnect', () => { store.dispatch(setConnected(true)) });
    client.on('socket/disconnect', () => { store.dispatch(setConnected(false)) });
    client.on('socket/error', error => {
        const reconnectionLimit = error.type === 'RECONNECTION_LIMIT';
        if (reconnectionLimit) {
            store.dispatch(setReconnectionLimit(true));
        }
    });
}
