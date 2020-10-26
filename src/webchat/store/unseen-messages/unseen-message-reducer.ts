/**
 * Unseen Messages
 */

import { Reducer } from "react";
import { IMessage } from "../../../common/interfaces/message";
import { SetOpenAction } from "../ui/ui-reducer";
import { AddMessageAction } from "../messages/message-reducer";

export type UnseenMessageState = IMessage[];

type UnseenMessageAction = AddMessageAction | SetOpenAction;

export const unseenMessages: Reducer<UnseenMessageState, UnseenMessageAction> = (state = [], action) => {
    switch (action.type) {
        case 'ADD_MESSAGE': {
            if (action.unseen) {
                return [...state, action.message];
            }

            return state;
        }

        case 'SET_OPEN': {
            if (action.open) {
                return [];
            }

            return state;
        }
    }

    return state;
}