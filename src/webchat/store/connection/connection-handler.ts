import { Store } from "redux";
import { setConnected } from "./connection-reducer";
import { SocketClient } from "@cognigy/socket-client";

export const registerConnectionHandler = (store: Store, client: SocketClient) => {
    client.on('socket/connect', () => { store.dispatch(setConnected(true)) });
    client.on('socket/disconnect', () => { store.dispatch(setConnected(false)) });
}