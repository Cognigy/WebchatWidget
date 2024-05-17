import { Middleware } from "redux";
import { StoreState } from "../store";
import { clearUnseenMessages } from "../unseen-messages/unseen-message-reducer";
import {
	setOpen,
	ToggleOpenAction,
	SetOpenAction,
	SetPageVisibleAction,
	SetHasAcceptedTermsAction,
} from "./ui-reducer";
import { getStorage } from "../../helper/storage";
import { setHasAcceptedTermsInStorage } from "../../helper/privacyPolicy";

export const uiMiddleware: Middleware<object, StoreState> =
	store =>
	next =>
	(
		action: ToggleOpenAction | SetOpenAction | SetPageVisibleAction | SetHasAcceptedTermsAction,
	) => {
		const { disableLocalStorage, useSessionStorage } =
			store.getState().config.settings.embeddingConfiguration;
		const browserStorage = getStorage({ useSessionStorage, disableLocalStorage });

		switch (action.type) {
			case "TOGGLE_OPEN": {
				const open = store.getState().ui.open;

				store.dispatch(setOpen(!open));

				break;
			}

			// if the webchat is opened while the page is active, reset unread messages
			case "SET_OPEN": {
				if (action.open && store.getState().ui.isPageVisible) {
					store.dispatch(clearUnseenMessages());
				}

				break;
			}

			// if the page gets active while the webchat is open, reset unread messages
			case "SET_PAGE_VISIBLE": {
				if (action.visible && store.getState().ui.open) {
					store.dispatch(clearUnseenMessages());
				}

				break;
			}

			// if the User accepts the privacy notice, we store it in local storage mapped to the user id
			case "SET_HAS_ACCEPTED_TERMS": {
				if (browserStorage) {
					setHasAcceptedTermsInStorage(browserStorage, action.userId);
				}

				break;
			}
		}

		return next(action);
	};
