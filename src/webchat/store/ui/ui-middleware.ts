import { Middleware } from "redux";
import { StoreState } from "../store";
import { setOpen, ToggleOpenAction } from "./ui-reducer";

export const uiMiddleware: Middleware<{}, StoreState> = store => next => (action: ToggleOpenAction) => {
    switch (action.type) {
        case 'TOGGLE_OPEN': {
            const open = store.getState().ui.open;

            return next(setOpen(!open));
        }
    }

    return next(action);
}
