import { Reducer } from "redux";
import { IMessage } from '../../../common/interfaces/message';

export type PreviousConversationsItem = {
    [key: string]: IMessage[];
};

export type PreviousConversationsState = {
    [key: string]: PreviousConversationsItem[];
};

const getInitialState = (): PreviousConversationsState => ({});

const SET_CONVERSATIONS = 'SET_CONVERSATIONS';
export const setConversations = (conversations: any) => ({
    type: SET_CONVERSATIONS as 'SET_CONVERSATIONS',
    conversations
});
export type SetConversationsAction = ReturnType<typeof setConversations>;

export const previousConversations: Reducer<PreviousConversationsState, SetConversationsAction> = (state = getInitialState(), action) => {
    switch (action.type) {
        case 'SET_CONVERSATIONS': {
            return action.conversations;
        }

        default:
            return state;
    }
};
