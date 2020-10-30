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

export const reducer = (state = rootReducer(undefined, { type: '' }), action) => {
    switch (action.type) {
        case 'RESET_STATE': {

            // We do not want to restore some properties from storage but keep the value from state
            const newState = action.state;
            
            // lossy ui state should not be restored, take the old value!
            newState.connection.connected = state.connection.connected;
            newState.ui.isPageVisible = state.ui.isPageVisible;
            newState.config = state.config;

            // do not restore unseen messages, would be weird with the open and isPageVisible state!
            newState.unseenMessages = [];

            // if the webchat was open already, do not close it again
            newState.ui.open = state.ui.open || newState.ui.open;

            return rootReducer(newState, { type: '' });
        };
    };

    return rootReducer(state, action);
};
