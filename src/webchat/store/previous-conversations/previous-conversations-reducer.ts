import { Reducer } from "redux";
import { IMessage } from "../../../common/interfaces/message";
import { RatingState } from "../rating/rating-reducer";
import { IMessageEvent } from "../../../common/interfaces/event";

export type PrevConversationsState = {
	[key: string]: {
		messages: (IMessage | IMessageEvent)[];
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

const UPSERT_PREV_CONVERSATION = "UPSERT_PREV_CONVERSATION";
export const upsertPrevConversation = (
	sessionId: string,
	conversation: PrevConversationsState[string],
) => ({
	type: UPSERT_PREV_CONVERSATION as "UPSERT_PREV_CONVERSATION",
	sessionId,
	conversation,
});
export type UpsertPrevConversation = ReturnType<typeof upsertPrevConversation>;

export const prevConversations: Reducer<
	PrevConversationsState,
	SetConversationsAction | UpsertPrevConversation
> = (state = getInitialState(), action) => {
	switch (action.type) {
		case "SET_CONVERSATIONS": {
			return action.conversations;
		}

		case "UPSERT_PREV_CONVERSATION": {
			const { sessionId, conversation } = action;
			return { ...state, [sessionId]: conversation };
		}

		default:
			return state;
	}
};
