import { Reducer } from "redux";
import { IMessage } from '../../../common/interfaces/message';

export type MessageState = IMessage[]

const ADD_MESSAGE = 'ADD_MESSAGE'
export const addMessage = (message: IMessage, unseen?: boolean) => ({
    type: ADD_MESSAGE as 'ADD_MESSAGE',
    message,
    unseen
});
export type AddMessageAction = ReturnType<typeof addMessage>;

const CLEAR_MESSAGES = 'CLEAR_MESSAGES';
export const clearMessages = () => ({
    type: CLEAR_MESSAGES as 'CLEAR_MESSAGES'
});
export type ClearMessagesAction = ReturnType<typeof clearMessages>;

export const messages: Reducer<MessageState, AddMessageAction | ClearMessagesAction> = (state = [], action) => {
    switch (action.type) {
        case 'ADD_MESSAGE': {
            return [...state, action.message];
        }
        case 'CLEAR_MESSAGES': {
            return [];
        }
    }

    return state;
}