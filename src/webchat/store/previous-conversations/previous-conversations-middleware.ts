import { Middleware } from "redux";
import { StoreState } from "../store";
import { getStorage } from "../../helper/storage";
import {
	PrevConversationsState,
	upsertPrevConversation,
} from "./previous-conversations-reducer";
import { SendMessageAction, TriggerEngagementMessageAction } from "../messages/message-middleware";
import { ReceiveMessageAction } from "../messages/message-handler";
import { RatingAction } from "../rating/rating-reducer";
import { SetPrevStateAction, setPrevState } from "../reducer";
import { SocketClient } from "@cognigy/socket-client";
import { isValidJSON } from "../../../webchat-ui/utils/isValidJSON";
import { getOptionsKey } from "../options/options";

const SWITCH_SESSION = "SWITCH_SESSION";
export const switchSession = (sessionId: string, conversation: PrevConversationsState[string]) => ({
	type: SWITCH_SESSION as "SWITCH_SESSION",
	sessionId,
	conversation,
});
export type SwitchSessionAction = ReturnType<typeof switchSession>;

const SYNC_STORAGE_TO_STATE = "SYNC_STORAGE_TO_STATE";
export const syncStorageToState = (key: string, value: string) => ({
	type: SYNC_STORAGE_TO_STATE as "SYNC_STORAGE_TO_STATE",
	key,
	value,
});
export type SyncStorageAction = ReturnType<typeof syncStorageToState>;

type Actions =
	| SwitchSessionAction
	| SetPrevStateAction
	| SyncStorageAction
	| SendMessageAction
	| ReceiveMessageAction
	| TriggerEngagementMessageAction
	| RatingAction;

export const createPrevConversationsMiddleware =
	(client: SocketClient): Middleware<object, StoreState> =>
	store =>
	next =>
	(action: Actions) => {
		switch (action.type) {
			case "SWITCH_SESSION": {
				const { sessionId, conversation } = action;
				client.switchSession(sessionId);
				store.dispatch(setPrevState(conversation));
				break;
			}
			case "SEND_MESSAGE":
			case "RECEIVE_MESSAGE":
			case "TRIGGER_ENGAGEMENT_MESSAGE":
			case "SHOW_RATING_DIALOG":
			case "SET_HAS_GIVEN_RATING":
			case "SET_CUSTOM_RATING_TITLE":
			case "SET_CUSTOM_RATING_COMMENT_TEXT": {
				const currentSession = store.getState().options.sessionId;
				if (!currentSession) break;

				const conversation = {
					messages: store.getState().messages,
					rating: store.getState().rating,
				};
				store.dispatch(upsertPrevConversation(currentSession, conversation));
				break;
			}
			case "SYNC_STORAGE_TO_STATE": {
				// The idea of this action is to get in sync the redux state with storage updates.
				// It makes sense only if the storage get updated from a another tab and we need to update redux conversations history
				// NOTE: This action get triggered only if the listener to 'storage' event in Webchat.tsx is active
				const { disableLocalStorage, useSessionStorage } = store.getState().config.settings;
				const browserStorage = getStorage({ useSessionStorage, disableLocalStorage });
				if (!browserStorage || !isValidJSON(action.value)) break;

				const sessionId: string = JSON.parse(action.key)?.[2] || "";
				if (!sessionId) break;

				const conversation = JSON.parse(action.value);
				const currentKey = getOptionsKey(store.getState().options, store.getState().config);
				if (currentKey === action.key) {
					// in this case the storage modified a key active in other tabs
					store.dispatch(setPrevState(conversation));
				}
				store.dispatch(upsertPrevConversation(sessionId, conversation));
				break;
			}
		}

		return next(action);
	};
