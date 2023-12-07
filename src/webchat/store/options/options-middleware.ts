import { Middleware } from "redux";
import { getOptionsKey } from "./options";
import { StoreState } from "../store";
import { SetOptionsAction } from "./options-reducer";
import { resetState } from "../reducer";
import { getAllConversations, getStorage } from "../../helper/storage";
import { setConversations } from "../previous-conversations/previous-conversations-reducer";
// import { SendMessageAction, TriggerEngagementMessageAction } from "../messages/message-middleware";
// import { ReceiveMessageAction } from "../messages/message-handler";
// import { RatingAction } from "../rating/rating-reducer";

// type Actions = SetOptionsAction | SendMessageAction | ReceiveMessageAction | TriggerEngagementMessageAction | RatingAction;

export const optionsMiddleware: Middleware<object, StoreState> = store => next => (action: SetOptionsAction) => {
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
					const prevConversations = getAllConversations(
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
			break;
		}

		// TODO: we need to activate this in order to make working the storage event listener (see Webchat.tsx)
		// The old logic on the bottom of this file is going to infinite loops,
		// we fix this by restricting the logic only to specific actions.
		// case "SEND_MESSAGE":
		// case "RECEIVE_MESSAGE":
		// case "TRIGGER_ENGAGEMENT_MESSAGE":
		// case "SHOW_RATING_DIALOG":
		// case "SET_HAS_GIVEN_RATING":
		// case "SET_CUSTOM_RATING_TITLE":
		// case "SET_CUSTOM_RATING_COMMENT_TEXT": {
		// 	if (browserStorage && active && userId && !disablePersistentHistory) {
		// 		const { messages, rating } = store.getState();
		// 		browserStorage.setItem(
		// 			key,
		// 			JSON.stringify({
		// 				messages,
		// 				rating,
		// 			}),
		// 		);
		// 	}
		// 	break;
		// }
	}

	// TODO: this block get excuted on every action dispached.
	// It would be anyway better to restrict only to the actions regarting
	// messages and rating reducer (see example above)
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
