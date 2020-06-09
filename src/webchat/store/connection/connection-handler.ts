import { Store } from "redux";
import { setConnected, setReconnectionLimit } from "./connection-reducer";
import { SocketClient } from "@cognigy/socket-client";

export const registerConnectionHandler = (store: Store, client: SocketClient) => {
    const handleConnected = () => {
        store.dispatch(setConnected(true))
    }

    const handleDisconnected = () => {
        store.dispatch(setConnected(false));
    }

    client.on('socket/connect', handleConnected);
    client.on('socket/reconnect', handleConnected);
    client.on('socket/pong', handleConnected);
    client.on('output', handleConnected);

    client.on('socket/disconnect', handleDisconnected);

    client.on('socket/error', error => {
        const reconnectionLimit = error.type === 'RECONNECTION_LIMIT';
        if (reconnectionLimit) {
            store.dispatch(setReconnectionLimit(true));
        }
    });
}
