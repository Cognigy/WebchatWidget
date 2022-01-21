import { Middleware } from "redux";
import { StoreState } from "../store";
import {
  SetOpenAction,
  SetPageVisibleAction,
  ToggleOpenAction,
} from "../ui/ui-reducer";
import { SendMessageAction } from "../messages/message-middleware";
import { setOptions } from "../options/options-reducer";
import { SocketClient } from "@cognigy/socket-client";
import { setConnecting, setReconnectionLimit } from "./connection-reducer";
import { shouldReestablishConnection } from "../../helper/connection-watchdog";

export interface ISendMessageOptions {
  /* overrides the displayed text within a chat bubble. useful for e.g. buttons */
  label: string;
}

const CONNECT = "CONNECT";
export const connect = () => ({
  type: CONNECT as "CONNECT",
});
export type ConnectAction = ReturnType<typeof connect>;

const NETWORK_ON = "NETWORK_ON";
export const announceNetworkOn = () => ({ type: NETWORK_ON as "NETWORK_ON" });
type announceNetworkOnAction = ReturnType<typeof announceNetworkOn>;

// forwards messages to the socket
export const createConnectionMiddleware =
  (client: SocketClient): Middleware<{}, StoreState> =>
  (store) =>
  (next) =>
  (
    action:
      | SetOpenAction
      | ToggleOpenAction
      | ConnectAction
      | SendMessageAction
      | SetPageVisibleAction
      | announceNetworkOnAction
  ) => {
    switch (action.type) {
      case "CONNECT": {
        if (!client.connected && !store.getState().connection.connecting) {
          store.dispatch(setConnecting(true));

          client
            .connect()
            .then(() => {
              // set options
              store.dispatch(setConnecting(false));
              store.dispatch(setReconnectionLimit(false));
              store.dispatch(setOptions(client.socketOptions));
            })
            .catch((error) => {
              store.dispatch(setConnecting(false));
            });
        }
        break;
      }

      case "SET_OPEN": {
        if (action.open) {
          if (!client.connected) {
            store.dispatch(connect());
          }
        }

        break;
      }

      case "SEND_MESSAGE": {
        store.dispatch(connect());

        break;
      }

      case "SET_PAGE_VISIBLE": {
        if (action.visible && shouldReestablishConnection(store.getState())) {
          store.dispatch(connect());
        }

        break;
      }

      case "NETWORK_ON": {
        if (shouldReestablishConnection(store.getState())) {
          store.dispatch(connect());
        }

        break;
      }
    }

    return next(action);
  };
