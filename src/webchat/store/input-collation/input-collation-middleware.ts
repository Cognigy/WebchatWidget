import { Middleware } from "redux";
import { IMessage } from "../../../common/interfaces/message";
import { sendMessage, SendMessageAction } from "../messages/message-middleware";
import { StoreState } from "../store";
import { addCollatedMessage, submitCollatedMessages, SubmitCollatedMessagesAction } from "./input-collation-reducer";


type InputCollationMiddlewareAction = SendMessageAction | SubmitCollatedMessagesAction;

/**
 * creates a middleware which can take care of "input collation" for messages
 * that were flagged with "collate" in their options.
 * 
 * IMPORTANT: this has to be loaded before the "message middleware" because it
 * intercepts actions
 */
export const createInputCollationMiddleware = (): Middleware<{}, StoreState> => {
    let collationTimeout: NodeJS.Timeout | null = null;

    return store => {
        const getCollatedMessage = (): IMessage => {
            const { messages } = store.getState().inputCollation;
            const text = messages.map(message => message.text).join(" ");

            const message = {
                ...messages[0],
                text,
                data: undefined
            };

            return message;
        }

        const clearCollationTimeout = () => {
            if (collationTimeout) {
                clearTimeout(collationTimeout);
                collationTimeout = null;
            }
        }

        return next => (action: InputCollationMiddlewareAction) => {
            switch (action.type) {
                case "SEND_MESSAGE": {
                    const { enableInputCollation, inputCollationTimeout } = store.getState().config.settings;

                    if (!enableInputCollation)
                        break;

                    const isCollateMessage = action.options?.collate;

                    /**
                     * In case we're handling a message that's not intended for collation,
                     * we have to send our collated message first and then continue with that message
                     */
                    if (!isCollateMessage) {
                        clearCollationTimeout();
                        next(sendMessage(getCollatedMessage()));
                        return next(action);
                    }

                    clearCollationTimeout();

                    /**
                     * Wait for the "collation timeout",
                     * then submit the collated messages
                     */
                    collationTimeout = setTimeout(() => {
                        store.dispatch(submitCollatedMessages());
                    }, inputCollationTimeout);

                    /**
                     * "intercept" the "SEND_MESSAGE" action and continue with 
                     * an "add to collation" action instead.
                     */
                    return next(addCollatedMessage(action.message));
                }

                case "SUBMIT_COLLATED_MESSAGES": {
                    /**
                     * clear any additional collation trigger
                     * (in case this was manually triggered)
                     */
                    clearCollationTimeout();

                    const message = getCollatedMessage();
                    next(action);
                    store.dispatch(sendMessage(message));

                    return;
                }
            }

            return next(action);
        }
    }
};