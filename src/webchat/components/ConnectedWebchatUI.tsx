import { WebchatUI, WebchatUIProps } from "../../webchat-ui";
import { connect } from "react-redux";
import { StoreState } from "../store/store";
import { sendMessage, triggerEngagementMessage } from '../store/messages/message-middleware';
import { setInputMode, setFullscreenMessage, setOpen, toggleOpen } from '../store/ui/ui-reducer';
import { getPluginsForMessage, isFullscreenPlugin } from '../../plugins/helper';
import { connect as doConnect } from "../store/connection/connection-middleware";
import { setHasGivenRating, showRatingDialog } from "../store/rating/rating-reducer";

type FromState = Pick<WebchatUIProps, 'messages' | 'unseenMessages' | 'open' | 'typingIndicator' | 'inputMode' | 'fullscreenMessage' | 'config' | 'connected' | 'reconnectionLimit'>;
type FromDispatch = Pick<WebchatUIProps, 'onSendMessage' | 'onSetInputMode' | 'onSetFullscreenMessage' | 'onDismissFullscreenMessage' | 'onClose' | 'onToggle' | 'onTriggerEngagementMessage'>;
export type FromProps = Pick<WebchatUIProps, 'messagePlugins' | 'inputPlugins' | 'webchatRootProps' | 'webchatToggleProps'>;
type Merge = FromState & FromDispatch & FromProps & Pick<WebchatUIProps, 'fullscreenMessage'>;

export const ConnectedWebchatUI = connect<FromState, FromDispatch, FromProps, Merge, StoreState>(
    ({
        messages,
        unseenMessages,
        connection: { connected, reconnectionLimit },
        ui: { open, typing, inputMode, fullscreenMessage },
        config,
		rating: { showRatingDialog, hasGivenRating, customRatingTitle, customRatingCommentText },
    }) => ({
        messages,
        unseenMessages,
        open,
        typingIndicator: typing,
        inputMode,
        fullscreenMessage,
        config,
        connected,
        reconnectionLimit,
        showRatingDialog,
        hasGivenRating,
		customRatingTitle,
		customRatingCommentText,
    }),
    dispatch => ({
        onSendMessage: (text, data, options) => dispatch(sendMessage({ text, data }, options)),
        onSetInputMode: inputMode => dispatch(setInputMode(inputMode)),
        onSetFullscreenMessage: message => dispatch(setFullscreenMessage(message)),
        onDismissFullscreenMessage: () => dispatch(setFullscreenMessage(undefined)),
        onClose: () => dispatch(setOpen(false)),
        onToggle: () => dispatch(toggleOpen()),
        onTriggerEngagementMessage: () => dispatch(triggerEngagementMessage()),
        onConnect: () => dispatch(doConnect()),
        onShowRatingDialog: (show: boolean) => dispatch(showRatingDialog(show)),
        onSetHasGivenRating: () => dispatch(setHasGivenRating()),
    }),
    ({ fullscreenMessage, ...state }, dispatch, props) => {
        if (!fullscreenMessage) {
            const lastMessage = state.messages.slice(-1)[0];

            const matchedPlugins = lastMessage
                ? getPluginsForMessage(props.messagePlugins || [], state.config)(lastMessage)
                : [];

            const lastPlugin = matchedPlugins.slice(-1)[0];


            fullscreenMessage = lastPlugin && isFullscreenPlugin(lastPlugin)
                ? lastMessage
                : undefined;
        }

        return {
            ...state,
            ...dispatch,
            ...props,
            fullscreenMessage
        }
    }
)(WebchatUI);
