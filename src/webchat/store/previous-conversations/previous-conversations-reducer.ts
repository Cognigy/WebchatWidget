import { Reducer } from "redux";
import { IMessage } from "../../../common/interfaces/message";
import { RatingState } from "../rating/rating-reducer";

export type PrevConversationsState = {
	[key: string]: {
		messages: IMessage[];
		rating: RatingState;
	};
};

const getInitialState = (): PrevConversationsState => ({});

const SET_CONVERSATIONS = "SET_CONVERSATIONS";
export const setConversations = (conversations: PrevConversationsState) => ({
	type: SET_CONVERSATIONS as "SET_CONVERSATIONS",
	conversations,
});
export type SetConversationsAction = ReturnType<typeof setConversations>;

const UPDATE_PREV_CONVERSATION = "UPDATE_PREV_CONVERSATION";
export const updatePrevConversation = (
	sessionId: string,
	conversation: PrevConversationsState[string],
) => ({
	type: UPDATE_PREV_CONVERSATION as "UPDATE_PREV_CONVERSATION",
	sessionId,
	conversation,
});
export type UpdatePrevConversation = ReturnType<typeof updatePrevConversation>;

export const prevConversations: Reducer<
	PrevConversationsState,
	SetConversationsAction | UpdatePrevConversation
> = (state = getInitialState(), action) => {
	switch (action.type) {
		case "SET_CONVERSATIONS": {
			return action.conversations;
		}

		case "UPDATE_PREV_CONVERSATION": {
			const { sessionId, conversation } = action;
			return { ...state, [sessionId]: conversation };
		}

		default:
			return state;
	}
};
