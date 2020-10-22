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
 * Unseen Messages
 */

export type UnseenMessageState = IMessage[];

const ADD_UNSEEN_MESSAGE = 'ADD_UNSEEN_MESSAGE'
export const addUnseenMessage = (message: IMessage) => ({
    type: ADD_UNSEEN_MESSAGE as 'ADD_UNSEEN_MESSAGE',
    message
});

const CLEAR_UNSEEN_MESSAGES = 'CLEAR_UNSEEN_MESSAGES'
export const clearUnseenMessages = () => ({
    type: CLEAR_UNSEEN_MESSAGES as 'CLEAR_UNSEEN_MESSAGES'
});

type UnseenMessageAction = ReturnType<typeof addUnseenMessage | typeof clearUnseenMessages>;

export const unseenMessages: Reducer<UnseenMessageState, UnseenMessageAction> = (state = [], action) => {
    switch (action.type) {
        case 'ADD_UNSEEN_MESSAGE': {
            return [...state, action.message];
        }
        case 'CLEAR_UNSEEN_MESSAGES': {
            return [];
        }
    }

    return state;
}