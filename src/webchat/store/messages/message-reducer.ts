import { Reducer } from "redux";
import { IMessage } from '../../../common/interfaces/message';

export type MessageState = IMessage[]

const ADD_MESSAGE = 'ADD_MESSAGE'
export const addMessage = (message: IMessage) => ({
    type: ADD_MESSAGE as 'ADD_MESSAGE',
    message
});
type AddMessageAction = ReturnType<typeof addMessage>;

export const messages: Reducer<MessageState, AddMessageAction> = (state = [], action) => {
    switch (action.type) {
        case 'ADD_MESSAGE': {
            return [...state, action.message];
        }
    }

    return state;
}

/**
 * Add Unseen Messages
 */

export type UnseenMessageState = IMessage[];

const ADD_UNSEEN_MESSAGE = 'ADD_UNSEEN_MESSAGE'
export const addUnseenMessage = (message: IMessage) => ({
    type: ADD_UNSEEN_MESSAGE as 'ADD_UNSEEN_MESSAGE',
    message
});
type AddUnseenMessageAction = ReturnType<typeof addUnseenMessage>;

export const unseenMessages: Reducer<UnseenMessageState, AddUnseenMessageAction> = (state = [], action) => {
    switch (action.type) {
        case 'ADD_UNSEEN_MESSAGE': {
            return [...state, action.message];
        }
    }

    return state;
}
 