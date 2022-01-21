/**
 * Unseen Messages
 */

import { Reducer } from "redux";
import { IMessage } from "../../../common/interfaces/message";
import { AddMessageAction } from "../messages/message-reducer";

export type UnseenMessageState = IMessage[];

const CLEAR_UNSEEN_MESSAGES = "CLEAR_UNSEEN_MESSAGES";
export const clearUnseenMessages = () => ({
  type: CLEAR_UNSEEN_MESSAGES as "CLEAR_UNSEEN_MESSAGES",
});
type ClearUnseenMessagesAction = ReturnType<typeof clearUnseenMessages>;

type UnseenMessageAction = AddMessageAction | ClearUnseenMessagesAction;

export const unseenMessages: Reducer<
  UnseenMessageState,
  UnseenMessageAction
> = (state = [], action) => {
  switch (action.type) {
    case "ADD_MESSAGE": {
      if (action.unseen) {
        return [...state, action.message];
      }

      return state;
    }

    case "CLEAR_UNSEEN_MESSAGES": {
      return [];
    }
  }

  return state;
};
