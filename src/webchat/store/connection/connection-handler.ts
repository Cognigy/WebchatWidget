import { Store } from "redux";
import { WebchatClient } from "@cognigy/webchat-client";
import { setConnected } from "./connection-reducer";

export const registerConnectionHandler = (store: Store, client: WebchatClient) => {
    client.on('socket/connect', () => { store.dispatch(setConnected(true)) });
    client.on('socket/disconnect', () => { store.dispatch(setConnected(false)) });
}