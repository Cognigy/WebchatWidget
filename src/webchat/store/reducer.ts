import { combineReducers } from "redux";
import { options } from "./options/options-reducer";
import { messages } from "./messages/message-reducer";
import { ui } from "./ui/ui-reducer";
import { config } from "./config/config-reducer";
import { connection } from "./connection/connection-reducer";
import { unseenMessages } from './unseen-messages/unseen-message-reducer';
import { StoreState } from "./store";

const rootReducer = combineReducers({
    messages,
    unseenMessages,
    options,
    config,
    ui,
    connection
});

const RESET_STATE = 'RESET_STATE';
export const resetState = (state?: StoreState) => ({
    type: RESET_STATE as 'RESET_STATE',
    state
});
export type ResetStateAction = ReturnType<typeof resetState>;

export const reducer = (currentState = rootReducer(undefined, { type: '' }), action) => {
    switch (action.type) {
        case 'RESET_STATE': {

            // We do not want to restore some properties from storage but keep the value from state
            const newState = action.state;
            
            // lossy ui state should not be restored, take the old value!
            newState.connection.connected = currentState.connection.connected;
            newState.connection.connecting = currentState.connection.connecting;
            newState.ui.isPageVisible = currentState.ui.isPageVisible;
            newState.config = currentState.config;

            // do not restore unseen messages, would be weird with the open and isPageVisible state!
            newState.unseenMessages = [];

            // if the webchat was open already, do not close it again
            newState.ui.open = currentState.ui.open || newState.ui.open;

            // prepend the restored history to the current history
            newState.messages = [...newState.messages, ...currentState.messages];

            return rootReducer(newState, { type: '' });
        };
    };

    return rootReducer(currentState, action);
};
