import { Reducer } from "redux";
import { IMessage } from "../../../common/interfaces/message";
import { RatingState } from "../rating/rating-reducer";

export type PreviousConversationsState = {
	[key: string]: {
		messages: IMessage[];
		ratings: RatingState;
	};
};

const getInitialState = (): PreviousConversationsState => ({});

const SET_CONVERSATIONS = "SET_CONVERSATIONS";
export const setConversations = (conversations: PreviousConversationsState) => ({
	type: SET_CONVERSATIONS as "SET_CONVERSATIONS",
	conversations,
});
export type SetConversationsAction = ReturnType<typeof setConversations>;

export const previousConversations: Reducer<PreviousConversationsState, SetConversationsAction> = (
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
