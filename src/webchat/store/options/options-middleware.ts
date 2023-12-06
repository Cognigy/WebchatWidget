import { Middleware } from "redux";
import { getOptionsKey } from "./options";
import { StoreState } from "../store";
import { SetOptionsAction } from "./options-reducer";
import { resetState } from "../reducer";
import { getAllConversationsByUserID, getStorage } from "../../helper/storage";
import { setConversations } from "../previous-conversations/previous-conversations-reducer";

type Actions = SetOptionsAction;

export const optionsMiddleware: Middleware<object, StoreState> = store => next => (action: Actions) => {
	const key = getOptionsKey(store.getState().options, store.getState().config);
	const { active } = store.getState().config; // Actual settings are loaded
	const { disableLocalStorage, disablePersistentHistory, useSessionStorage } =
		store.getState().config.settings;
	const { userId } = store.getState().options;
	const browserStorage = getStorage({ useSessionStorage, disableLocalStorage });

	switch (action.type) {
		case "SET_OPTIONS": {
			// TODO decouple this into a separate action or middleware handler
			if (browserStorage) {
				const key = getOptionsKey(action.options, store.getState().config);
				const persistedString = browserStorage.getItem(key);

				if (action.options?.userId) {
					const prevConversations = getAllConversationsByUserID(
						browserStorage,
						action.options?.userId,
						action.options?.sessionId,
						store.getState().config?.URLToken
					);
					store.dispatch(setConversations(prevConversations));
				}

				if (persistedString) {
					try {
						const persisted = JSON.parse(persistedString);

						store.dispatch(resetState(persisted));
					} catch (e) {}
				}
			}
		}
	}

	if (browserStorage && active && userId && !disablePersistentHistory) {
		const { messages, rating } = store.getState();
		browserStorage.setItem(
			key,
			JSON.stringify({
				messages,
				rating,
			}),
		);
	}

	return next(action);
};
