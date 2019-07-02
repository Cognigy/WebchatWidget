
import { WebchatClient } from "@cognigy/webchat-client";
import { Middleware } from "redux";
import { StoreState } from "../store";
import { SetOpenAction, ToggleOpenAction } from "../ui/ui-reducer";
import { SendMessageAction } from "../messages/message-middleware";
import { ReceiveMessageAction } from "../messages/message-handler";

type AnalyticsAction = SetOpenAction | ToggleOpenAction | SendMessageAction | ReceiveMessageAction;

// creates an analytics middleware that emits events on the client
export const createAnalyticsMiddleware = (client: WebchatClient): Middleware<{}, StoreState> => store => next => (action: AnalyticsAction) => {
    switch (action.type) {
        case 'SET_OPEN': {
            client.emitAnalytics(action.open ? 'webchat/open' : 'webchat/close');
            break;
        }

        case 'TOGGLE_OPEN': {
            const open = !store.getState().ui.open;
            client.emitAnalytics(open ? 'webchat/open' : 'webchat/close');
            break;
        }

        case 'SEND_MESSAGE': {
            client.emitAnalytics('webchat/outgoing-message', action.message);
            break;
        }

        case 'RECEIVE_MESSAGE': {
            if (action.message.text || action.message.data) {
                client.emitAnalytics('webchat/incoming-message', action.message);
            }
            break;
        }
    }

    return next(action);
}