import { WebchatUI, WebchatUIProps } from "../../webchat-ui";
import { connect } from "react-redux";
import { StoreState } from "../store/store";
import { sendMessage, triggerEngagementMessage } from '../store/messages/message-middleware';
import { setInputMode, setFullscreenMessage, setOpen, toggleOpen, setScrollToPosition, setLastScrolledPosition, setShowHomeScreen, setShowPrevConversations, setShowChatOptionsScreen, setHasAcceptedTerms, UIState, setStoredMessage } from '../store/ui/ui-reducer';
import { getPluginsForMessage, isFullscreenPlugin } from '../../plugins/helper';
import { connect as doConnect } from "../store/connection/connection-middleware";
import { setHasGivenRating, showRatingScreen } from "../store/rating/rating-reducer";
import { switchSession } from "../store/previous-conversations/previous-conversations-middleware";
import { PrevConversationsState } from "../store/previous-conversations/previous-conversations-reducer";
import { IFile, setDropZoneVisible, setFileList, setFileUploadError } from "../store/input/input-reducer";
import { openOverlay } from "../store/xapp-overlay/slice";

type FromState = Pick<WebchatUIProps, 'messages' | 'unseenMessages' | 'prevConversations' | 'open' | 'typingIndicator' | 'inputMode' | 'fullscreenMessage' | 'config' | 'connected' | 'reconnectionLimit' | 'scrollToPosition'| 'lastScrolledPosition'>;
type FromDispatch = Pick<WebchatUIProps, 'onSendMessage' | 'onSetInputMode' | 'onSetFullscreenMessage' | 'onDismissFullscreenMessage' | 'onClose' | 'onToggle' | 'onSetScrollToPosition' | 'onSetLastScrolledPosition' | 'onTriggerEngagementMessage'>;
export type FromProps = Pick<WebchatUIProps, 'messagePlugins' | 'inputPlugins' | 'webchatRootProps' | 'webchatToggleProps'>;
type Merge = FromState & FromDispatch & FromProps & Pick<WebchatUIProps, 'fullscreenMessage'>;

export const ConnectedWebchatUI = connect<FromState, FromDispatch, FromProps, Merge, StoreState>(
    ({
        messages,
        unseenMessages,
        prevConversations,
        connection: { connected, reconnectionLimit },
        ui: { open, typing, inputMode, fullscreenMessage, scrollToPosition, lastScrolledPosition, showHomeScreen, showPrevConversations, showChatOptionsScreen, hasAcceptedTerms },
        config,
        options: { sessionId },
        rating: { showRatingScreen, hasGivenRating, requestRatingScreenTitle, customRatingTitle, customRatingCommentText, requestRatingSubmitButtonText, requestRatingEventBannerText, requestRatingChatStatusBadgeText },
        input: { sttActive, textActive, isDropZoneVisible, fileList, fileUploadError },
        xAppOverlay: { open: isXAppOverlayOpen}
    }) => ({
        currentSession: sessionId,
        messages,
        unseenMessages,
        prevConversations,
        open,
        typingIndicator: typing,
        scrollToPosition,
        lastScrolledPosition,
        inputMode,
        fullscreenMessage,
        config,
        connected,
        reconnectionLimit,
        showRatingScreen,
        hasGivenRating,
        requestRatingScreenTitle,
        customRatingTitle,
        customRatingCommentText,
        requestRatingSubmitButtonText,
        requestRatingEventBannerText,
        requestRatingChatStatusBadgeText,
        showHomeScreen,
        sttActive,
        textActive,
        isDropZoneVisible,
        fileList,
        fileUploadError,
        showPrevConversations,
        showChatOptionsScreen,
        hasAcceptedTerms,
        isXAppOverlayOpen,
    }),
    dispatch => ({
        onSendMessage: (text, data, options) => dispatch(sendMessage({ text, data }, options)),
        onSetInputMode: inputMode => dispatch(setInputMode(inputMode)),
        onSetFullscreenMessage: message => dispatch(setFullscreenMessage(message)),
        onDismissFullscreenMessage: () => dispatch(setFullscreenMessage(undefined)),
        onClose: () => dispatch(setOpen(false)),
        onToggle: () => dispatch(toggleOpen()),
        onSetScrollToPosition: (position: number) => dispatch(setScrollToPosition(position)),
        onSetLastScrolledPosition: (position: number | null) => dispatch(setLastScrolledPosition(position)),
        onTriggerEngagementMessage: () => dispatch(triggerEngagementMessage()),
        onConnect: () => dispatch(doConnect()),
        onShowRatingScreen: (show: boolean) => dispatch(showRatingScreen(show)),
        onSetHasGivenRating: () => dispatch(setHasGivenRating()),
        onSetShowHomeScreen: (show: boolean) => dispatch(setShowHomeScreen(show)),
        onSetShowPrevConversations: (show: boolean) => dispatch(setShowPrevConversations(show)),
        onSetShowChatOptionsScreen: (show: boolean) => dispatch(setShowChatOptionsScreen(show)),
        onSwitchSession: (sessionId?: string, conversation?: PrevConversationsState[string]) => dispatch(switchSession(sessionId, conversation)),
        onAcceptTerms: () => dispatch(setHasAcceptedTerms()),
        onSetStoredMessage: (message: UIState['storedMessage']) => dispatch(setStoredMessage(message)),
        onSetDropZoneVisible: (isVisible: boolean) => dispatch(setDropZoneVisible(isVisible)),
        onSetFileList: (fileList: IFile[]) => dispatch(setFileList(fileList)),
        onSetFileUploadError: (error: boolean) => dispatch(setFileUploadError(error)),
        openXAppOverlay: (url: string) => dispatch(openOverlay(url)),
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
