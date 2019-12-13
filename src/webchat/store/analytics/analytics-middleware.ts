
import { Middleware } from "redux";
import { StoreState } from "../store";
import { SetOpenAction, ToggleOpenAction } from "../ui/ui-reducer";
import { SendMessageAction } from "../messages/message-middleware";
import { ReceiveMessageAction } from "../messages/message-handler";
import { Webchat } from "../../components/Webchat";

type AnalyticsAction = SetOpenAction | ToggleOpenAction | SendMessageAction | ReceiveMessageAction;

// creates an analytics middleware that emits events on the client
export const createAnalyticsMiddleware = (webchat: Webchat): Middleware<{}, StoreState> => store => next => (action: AnalyticsAction) => {
    switch (action.type) {
        case 'SET_OPEN': {
            webchat.emitAnalytics(action.open ? 'webchat/open' : 'webchat/close');
            break;
        }

        case 'TOGGLE_OPEN': {
            const open = !store.getState().ui.open;
            webchat.emitAnalytics(open ? 'webchat/open' : 'webchat/close');
            break;
        }

        case 'SEND_MESSAGE': {
            webchat.emitAnalytics('webchat/outgoing-message', action.message);
            break;
        }

        case 'RECEIVE_MESSAGE': {
            if (action.message.text || action.message.data) {
                webchat.emitAnalytics('webchat/incoming-message', action.message);
            }
            break;
        }
    }

    return next(action);
}