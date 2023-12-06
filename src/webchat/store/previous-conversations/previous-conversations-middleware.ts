import { Middleware } from "redux";
import { StoreState } from "../store";
import { getAllConversationsByUserID, getStorage } from "../../helper/storage";
import { PrevConversationsState, setConversations } from "./previous-conversations-reducer";
import { SetPrevStateAction, setPrevState } from "../reducer";
import { SocketClient } from "@cognigy/socket-client";
import { isValidJSON } from "../../../webchat-ui/utils/isValidJSON";

const SWITCH_SESSION = "SWITCH_SESSION";
export const switchSession = (sessionId: string, conversation: PrevConversationsState[string]) => ({
	type: SWITCH_SESSION as "SWITCH_SESSION",
	sessionId,
	conversation,
});
export type SwitchSessionAction = ReturnType<typeof switchSession>;

const SYNC_STORAGE = 'SYNC_STORAGE';
export const syncStorage = (key?: string | null) => ({
    type: SYNC_STORAGE as 'SYNC_STORAGE',
    key
});
export type SyncStorageAction = ReturnType<typeof syncStorage>;

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
				const { disableLocalStorage, useSessionStorage } = store.getState().config.settings;
                const browserStorage = getStorage({ useSessionStorage, disableLocalStorage });

				const isPrevSession = !!store.getState().prevConversations?.[currentSession];
				if (isPrevSession) {
					if (browserStorage && currentUser && currentToken) {
						const prevConversations = getAllConversationsByUserID(
							browserStorage,
							currentUser,
							currentSession,
							currentToken,
						);
						store.dispatch(setConversations(prevConversations));
					}
				}
				break;
            }
            case "SYNC_STORAGE": {
                const currentUser = store.getState().options.userId;
                const currentToken = store.getState().config?.URLToken;
                const { disableLocalStorage, useSessionStorage } = store.getState().config.settings;
                const browserStorage = getStorage({ useSessionStorage, disableLocalStorage });

                const { key } = action;
                if (key && browserStorage && browserStorage && currentUser && currentToken) {
                    const changedItem = browserStorage.getItem(key);
                    if (changedItem && isValidJSON(changedItem)) {
                        const conversation = JSON.parse(changedItem);
                        store.dispatch(setPrevState(conversation));
                    }
                }
                break;
            }
            case "SWITCH_SESSION": {
				const { sessionId, conversation } = action;
				client.switchSessionId(sessionId);
                store.dispatch(setPrevState(conversation));
                break;
			}
		}

		return next(action);
	};
