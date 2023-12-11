import { Reducer } from "redux";
import { SetConfigAction } from '../config/config-reducer';
import { SetConnectedAction } from '../connection/connection-reducer';
import { SetOptionsAction } from "../options/options-reducer";
import { SetOpenAction } from '../ui/ui-reducer';

const getInitialState = () => ({
    isOpenedOnce: false,
    isConnectedOnce: false,
    isConfiguredOnce: false,
    isSessionRestoredOnce: false,
    isAutoInjectHandled: false
});

export type TAutoInjectState = ReturnType<typeof getInitialState>;

const TRIGGER_AUTO_INJECT = 'TRIGGER_AUTO_INJECT';
export const triggerAutoInject = () => ({
    type: TRIGGER_AUTO_INJECT as 'TRIGGER_AUTO_INJECT',
});
export type TTriggerAutoInjectAction = ReturnType<typeof triggerAutoInject>;

const AUTO_INJECT_HANDLED = 'AUTO_INJECT_HANDLED';
export const autoInjectHandled = () => ({
    type: AUTO_INJECT_HANDLED as 'AUTO_INJECT_HANDLED',
});
export type TAutoInjectTriggeredAction = ReturnType<typeof autoInjectHandled>;

const AUTO_INJECT_HANDLED_RESET = 'AUTO_INJECT_HANDLED_RESET';
export const autoInjectHandledReset = () => ({
    type: AUTO_INJECT_HANDLED_RESET as 'AUTO_INJECT_HANDLED_RESET',
});
export type TAutoInjectResetAction = ReturnType<typeof autoInjectHandledReset>;

export type TAutoInjectAction =
    | SetConnectedAction
    | SetOpenAction
    | SetOptionsAction
    | SetConfigAction
    | TTriggerAutoInjectAction
    | TAutoInjectTriggeredAction
    | TAutoInjectResetAction;

/**
 * This reducer collects and manages information about
 * - whether the auto-inject message is ready to be sent
 * - whether the auto-inject message has been sent already
 */
export const autoInject: Reducer<TAutoInjectState, TAutoInjectAction> = (state = getInitialState(), action) => {
    switch (action.type) {
        case 'SET_CONNECTED': {
            if (action.connected && !state.isConnectedOnce) {
                return {
                    ...state,
                    isConnectedOnce: true
                }
            }

            break;
        }

        case 'SET_OPEN': {
            if (action.open && !state.isOpenedOnce) {
                return {
                    ...state,
                    isOpenedOnce: true
                }
            }

            break;
        }

        case 'SET_CONFIG': {
            if (!state.isConfiguredOnce) {
                return {
                    ...state,
                    isConfiguredOnce: true
                }
            }

            break;
        }

        case 'SET_OPTIONS': {
            if (!state.isSessionRestoredOnce) {
                return {
                    ...state,
                    isSessionRestoredOnce: true
                }
            }

            break;
        }

        case 'AUTO_INJECT_HANDLED': {
            if (!state.isAutoInjectHandled) {
                return {
                    ...state,
                    isAutoInjectHandled: true
                }
            }

            break;
        }
            
        case 'AUTO_INJECT_HANDLED_RESET': {
            if (state.isAutoInjectHandled) {
                return {
                    ...state,
                    isAutoInjectHandled: false
                }
            }

            break;
        }
    }

    return state;
}