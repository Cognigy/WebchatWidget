import * as React from 'react';
import { WebchatUI, WebchatUIProps } from "../../webchat-ui";
import { connect } from "react-redux";
import { StoreState } from "../store/store";
import { sendMessage } from '../store/messages/message-middleware';
import { setInputMode, setFullscreenMessage, setOpen } from '../store/ui/ui-reducer';
import { MessagePlugin } from '../../common/interfaces/message-plugin';
import { IMessage } from '../../common/interfaces/message';
import { getPluginsForMessage, isFullscreenPlugin } from '../../plugins/helper';

type FromState = Pick<WebchatUIProps, 'messages' | 'open' | 'typingIndicator' | 'inputMode' | 'fullscreenMessage' | 'config'>;
type FromDispatch = Pick<WebchatUIProps, 'onSendMessage' | 'onSetInputMode' | 'onSetFullscreenMessage' | 'onDismissFullscreenMessage'>;
type FromProps = Pick<WebchatUIProps, 'messagePlugins' | 'inputPlugins'>;
type Merge = FromState & FromDispatch & FromProps & Pick<WebchatUIProps, 'fullscreenMessage'>;

export const ConnectedWebchatUI = connect<FromState, FromDispatch, FromProps, Merge, StoreState>(
    ({ messages, ui: { open, typing, inputMode, fullscreenMessage }, config }) => ({
        messages,
        open,
        typingIndicator: typing,
        inputMode,
        fullscreenMessage,
        config
    }),
    dispatch => ({
        onSendMessage: (text, data, options) => dispatch(sendMessage({ text, data }, options)),
        onSetInputMode: inputMode => dispatch(setInputMode(inputMode)),
        onSetFullscreenMessage: message => dispatch(setFullscreenMessage(message)),
        onDismissFullscreenMessage: () => dispatch(setFullscreenMessage(undefined)),
        onClose: () => dispatch(setOpen(false))
    }),
    ({ fullscreenMessage, ...state }, dispatch, props) => {
        if (!fullscreenMessage) {
            const lastMessage = state.messages.slice(-1)[0];

            const matchedPlugins = lastMessage
                ? getPluginsForMessage(props.messagePlugins || [])(lastMessage)
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