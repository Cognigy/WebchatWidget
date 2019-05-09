import { Reducer } from "redux";
import { IMessage } from '../../../common/interfaces/message';

export type MessageState = IMessage[]

export const ADD_MESSAGE = 'ADD_MESSAGE'
export const addMessage = (message: IMessage) => ({
    type: ADD_MESSAGE as 'ADD_MESSAGE',
    message
});
export type AddMessageAction = ReturnType<typeof addMessage>;

export const messages: Reducer<MessageState, AddMessageAction> = (state = [], action) => {
    switch (action.type) {
        case 'ADD_MESSAGE': {
            return [...state, action.message];
        }
    }

    return state;
}