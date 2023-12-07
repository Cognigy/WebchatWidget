import { combineReducers } from "redux";
import { options } from "./options/options-reducer";
import { messages } from "./messages/message-reducer";
import { ui } from "./ui/ui-reducer";
import { config } from "./config/config-reducer";
import { connection } from "./connection/connection-reducer";
import { unseenMessages } from './unseen-messages/unseen-message-reducer';
import { autoInject } from './autoinject/autoinject-reducer';
import { rating } from "./rating/rating-reducer";
import { inputCollation } from "./input-collation/input-collation-reducer";
import { input } from "./input/input-reducer";
import { prevConversations } from "./previous-conversations/previous-conversations-reducer";
import { StoreState } from "./store";

const rootReducer = combineReducers({
    messages,
    unseenMessages,
    options,
    config,
    autoInject,
    rating,
    ui,
    connection,
    inputCollation,
    input,
    prevConversations
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
            // We only restore messages and prepend them to the current message history
            return rootReducer({
                ...state,
                messages: [
                    ...action.state.messages,
                    ...state.messages,
                ],
                rating: {
                    ...state.rating,
                    hasGivenRating: action.state.rating.hasGivenRating,
                }
            }, { type: '' })
        };
    };

    return rootReducer(state, action);
};
