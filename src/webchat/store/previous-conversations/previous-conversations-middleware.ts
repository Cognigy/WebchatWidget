import { Middleware } from "redux";
import { StoreState } from "../store";
import { getAllConversationsByUserID, getStorage } from "../../helper/storage";
import {
	PrevConversationsState,
	setConversations,
	updatePrevConversation,
} from "./previous-conversations-reducer";
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

type Actions = SwitchSessionAction | SetPrevStateAction | SyncStorageAction;

export const createprevConversationsMiddleware =
	(client: SocketClient): Middleware<object, StoreState> =>
	store =>
	next =>
	(action: Actions) => {
		switch (action.type) {
			case "SET_PREV_STATE": {
				const currentSession = store.getState().options.sessionId;
				const currentUser = store.getState().options.userId;
				const currentToken = store.getState().config?.URLToken;
				if (!currentSession || !currentUser || !currentToken) break;

				const { disableLocalStorage, useSessionStorage } = store.getState().config.settings;
				const browserStorage = getStorage({ useSessionStorage, disableLocalStorage });
				if (!browserStorage) break;

				const isPrevSession = !!store.getState().prevConversations?.[currentSession];
				if (!isPrevSession) break;

				const prevConversations = getAllConversationsByUserID(
					browserStorage,
					currentUser,
					currentSession,
					currentToken,
				);
				store.dispatch(setConversations(prevConversations));
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
					// in this case the storage modified key is active in other tabs
					store.dispatch(setPrevState(conversation));
				} else if (store.getState()?.prevConversations?.[sessionId]) {
					// in this case another tab updated the history of a previous conversation
					store.dispatch(updatePrevConversation(sessionId, conversation));
				}
				break;
			}
			case "SWITCH_SESSION": {
				const { sessionId, conversation } = action;
				client.switchSession(sessionId);
				store.dispatch(setPrevState(conversation));
				break;
			}
		}

		return next(action);
	};
