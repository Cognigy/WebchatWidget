import { Middleware } from "redux";
import { getOptionsKey } from "./options";
import { StoreState } from "../store";
import { SetOptionsAction } from "./options-reducer";
import { resetState } from "../reducer";

type Actions = SetOptionsAction

export const optionsMiddleware: Middleware<{}, StoreState> = store => next => (action: Actions) => {
    const key = getOptionsKey(store.getState().options);

    switch (action.type) {
        case 'SET_OPTIONS': {
            const key = getOptionsKey(action.options);
            if (localStorage) {
                const persistedString = localStorage.getItem(key);

                if (persistedString) {
                    try {
                        const persisted = JSON.parse(persistedString);

                        return next(resetState(persisted));
                    } catch (e) { }
                }
            }
        }
    }

    const { active } = store.getState().config;
    const { disablePersistentHistory } = store.getState().config.settings;

    if (localStorage && active && !disablePersistentHistory) {
        localStorage.setItem(key, JSON.stringify(store.getState()));
    }

    return next(action);
}