import { Middleware } from "redux";
import { StoreState } from "../store";
import { autoInjectHandled, TAutoInjectAction, triggerAutoInject } from './autoinject-reducer';
import { Webchat } from "../../components/Webchat";

export const createAutoInjectMiddleware = (webchat: Webchat): Middleware<unknown, StoreState> => api => next => (action: TAutoInjectAction) => {
    switch (action.type) {
        case 'SET_CONFIG':
        case 'SET_CONNECTED':
        case 'SET_OPEN':
        case 'SET_OPTIONS': {
            const nextActionResult = next(action);
            
            (() => {
                const state = api.getState();
                const { isAutoInjectHandled: isAutoInjectTriggered, isConfiguredOnce, isConnectedOnce, isOpenedOnce, isSessionRestoredOnce } = state.autoInject;
                
                if (isAutoInjectTriggered)
                    return;
                
                if (!isConfiguredOnce || !isConnectedOnce || !isOpenedOnce || !isSessionRestoredOnce)
                    return;
                
                api.dispatch(triggerAutoInject());
            })();

            return nextActionResult;

        }

        case 'TRIGGER_AUTO_INJECT': {
            const state = api.getState();
            // Now is the time to handle the "auto-inject message" (if configured)


            // This should be handled just once, so let's trigger it to be handled!
            api.dispatch(autoInjectHandled());

            // Don't send a message if "startBehavior" is not set to "injection"
            if (state.config.settings.startBehavior !== 'injection') {
                break;
            }

            // Don't send a message if an "engagement message" is in the message history
            const isEmptyExceptEngagementMesage = state.messages
                .filter(message => message.source !== 'engagement')
                .length === 0;

            if (!isEmptyExceptEngagementMesage) {
                break;
            }

            // We are going to send the auto-inject message, now!
            const text = state.config.settings.getStartedPayload;
            const label = state.config.settings.getStartedText;

            webchat.sendMessage(text, {}, { label });
            break;
        }
    }

    return next(action);
}