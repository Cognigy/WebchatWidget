import { createStore, applyMiddleware } from 'redux';
import { StateType } from 'typesafe-actions';
import { WebchatClient } from '@cognigy/webchat-client/lib/webchat-client';
import { createMessageMiddleware } from './messages/message-middleware';
import { registerMessageHandler } from './messages/message-handler';
import { optionsMiddleware } from './options/options-middleware';
import { reducer } from './reducer';
import { registerTypingHandler } from './typing/typing-handler';
import { createConnectionMiddleware } from './connection/connection-middleware';
import { createConfigMiddleware } from './config/config-middleware';
import { IWebchatConfig, IWebchatSettings } from '@cognigy/webchat-client/lib/interfaces/webchat-config';


export type StoreState = StateType<typeof reducer>;

// creates a store and connects it to a webchat client
export const createWebchatStore = (client: WebchatClient, defaultSettings?: IWebchatSettings) => {

    const store = createStore(
        reducer,
        applyMiddleware(
            createConnectionMiddleware(client),
            createMessageMiddleware(client),
            createConfigMiddleware(client, defaultSettings),
            optionsMiddleware,
        )
    );

    registerMessageHandler(store, client);
    registerTypingHandler(store, client);

    return store;
}