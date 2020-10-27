import { Middleware } from "redux";
import { StoreState } from "../store";
import { clearUnseenMessages } from "../unseen-messages/unseen-message-reducer";
import { setOpen, ToggleOpenAction, SetOpenAction, SetPageVisibleAction } from "./ui-reducer";

export const uiMiddleware: Middleware<{}, StoreState> = store => next => (action: ToggleOpenAction | SetOpenAction | SetPageVisibleAction) => {
    switch (action.type) {
        case 'TOGGLE_OPEN': {
            const open = store.getState().ui.open;

            return next(setOpen(!open));
        }

        // if the webchat is opened while the page is active, reset unread messages
        case 'SET_OPEN': {
            if (action.open && store.getState().ui.isPageVisible) {
                next(clearUnseenMessages());
            }

            break;
        }

        // if the page gets active while the webchat is open, reset unread messages
        case 'SET_PAGE_VISIBLE': {
            if (action.visible && store.getState().ui.open) {
                next(clearUnseenMessages());
            }
        }
    }

    return next(action);
}
