import { Reducer } from "redux";
import { IMessage } from '../../../common/interfaces/message';
import { IMessageEvent } from "../../../common/interfaces/event";

export type MessageState = (IMessage | IMessageEvent)[]

const ADD_MESSAGE = 'ADD_MESSAGE'
export const addMessage = (message: IMessage, unseen?: boolean) => ({
    type: ADD_MESSAGE as 'ADD_MESSAGE',
    message,
    unseen
});
export type AddMessageAction = ReturnType<typeof addMessage>;

const ADD_MESSAGE_EVENT = 'ADD_MESSAGE_EVENT'
export const addMessageEvent = (event: IMessageEvent) => ({
    type: ADD_MESSAGE_EVENT as 'ADD_MESSAGE_EVENT',
    event
});
export type AddMessageEventAction = ReturnType<typeof addMessageEvent>;

export const messages: Reducer<MessageState, AddMessageAction | AddMessageEventAction> = (state = [], action) => {
    switch (action.type) {
        case 'ADD_MESSAGE_EVENT': {
            return [...state, action.event];
        }
        case 'ADD_MESSAGE': {
            return [...state, action.message];
        }
    }

    return state;
}