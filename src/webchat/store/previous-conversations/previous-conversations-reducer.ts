import { Reducer } from "redux";
import { IMessage } from "../../../common/interfaces/message";
import { RatingState } from "../rating/rating-reducer";

export type PrevConversationsState = {
	[key: string]: {
		messages: IMessage[];
		ratings: RatingState;
	};
};

const getInitialState = (): PrevConversationsState => ({});

const SET_CONVERSATIONS = "SET_CONVERSATIONS";
export const setConversations = (conversations: PrevConversationsState) => ({
	type: SET_CONVERSATIONS as "SET_CONVERSATIONS",
	conversations,
});
export type SetConversationsAction = ReturnType<typeof setConversations>;

export const prevConversations: Reducer<PrevConversationsState, SetConversationsAction> = (
	state = getInitialState(),
	action,
) => {
	switch (action.type) {
		case "SET_CONVERSATIONS": {
			return action.conversations;
		}

		default:
			return state;
	}
};
