import React from 'react';
import { IMessage } from '../../common/interfaces/message';
import Header from './presentational/Header';
import { CacheProvider, ThemeProvider } from '@emotion/react';
import styled from '@emotion/styled';
import { IWebchatTheme, createWebchatTheme } from '../style';
import WebchatRoot from './presentational/WebchatRoot';
import { History } from './history/History';
import createCache from '@emotion/cache';
import { isolate } from '../utils/css';
import { MessagePlugin } from '../../common/interfaces/message-plugin';
import FullScreenMessage from './history/FullScreenMessage';
import Input from './plugins/InputPluginRenderer';
import baseInputPlugin from './plugins/input/base';
import MessagePluginRenderer from './plugins/MessagePluginRenderer';
import regularMessagePlugin from './plugins/message/regular';
import { InputPlugin } from '../../common/interfaces/input-plugin';
import stylisRTL from 'stylis-rtl';

import '../utils/normalize.css';
import { MessageSender } from '../interfaces';
import { ChatScroller } from './history/ChatScroller';
import FAB from './presentational/FAB';
import WebchatWrapper from './presentational/WebchatWrapper';
import ChatIcon from '../assets/baseline-chat-24px.svg';
import CollapseIcon from '../assets/collapse-20px.svg';
import DisconnectOverlay from './presentational/DisconnectOverlay';
import { IWebchatConfig } from '../../common/interfaces/webchat-config';
import { TTyping } from '../../common/interfaces/typing';
import UnreadMessagePreview from './presentational/UnreadMessagePreview';
import Badge from './presentational/Badge';
import getTextFromMessage from '../../webchat/helper/message';
import getKeyboardFocusableElements from '../utils/find-focusable';
import notificationSound from '../utils/notification-sound';
import { findReverse } from '../utils/find-reverse';
import "../../assets/style.css";
import TypingIndicator from './history/TypingIndicator';
import RatingDialog from './presentational/RatingDialog';
import { isDisabledOutOfBusinessHours, isHiddenOutOfBusinessHours, isInformingOutOfBusinessHours } from '../../webchat/helper/businessHours';
import { isDisabledDueToMaintenance, isHiddenDueToMaintenance, isInformingDueToMaintenance } from '../../webchat/helper/maintenance';
import FABDisabled from './presentational/FABDisabled';
import { isDisabledDueToConnectivity, isHiddenDueToConnectivity, isInformingDueToConnectivity } from '../../webchat/helper/connectivity';
import { HomeScreen } from './presentational/HomeScreen';
import { PrevConversationsScreen } from './presentational/previous-conversations/OverviewScreen';
import { PrevConversationsState } from '../../webchat/store/previous-conversations/previous-conversations-reducer';
import Notifications from './presentational/Notifications';

export interface WebchatUIProps {
    messages: IMessage[];
    unseenMessages: IMessage[];
    fullscreenMessage?: IMessage;
    onSetFullscreenMessage: (message: IMessage) => void;
    onDismissFullscreenMessage: () => void;

    onSendMessage: MessageSender;
    config: IWebchatConfig;
    typingIndicator: TTyping;

    open: boolean;

    messagePlugins?: MessagePlugin[];
    inputPlugins: InputPlugin[];

    inputMode: string;
    onSetInputMode: (inputMode: string) => void;
    onClose: () => void;
    onConnect: () => void;
    onToggle: () => void;
    onSetScrollToPosition: (position: number) => void;
    onSetLastScrolledPosition: (position: number | null) => void;
    scrollToPosition: number;
    lastScrolledPosition: number | null;

    onEmitAnalytics: (event: string, payload?: any) => void;
    onTriggerEngagementMessage: () => void;

    webchatRootProps?: React.ComponentProps<typeof WebchatRoot>;
    webchatToggleProps?: React.ComponentProps<typeof FAB>;

    connected: boolean;
    reconnectionLimit: boolean;

    hasGivenRating: boolean;
    showRatingDialog: boolean;
    onShowRatingDialog: (show: boolean) => void;
    onSetHasGivenRating: () => void;
    customRatingTitle: string;
    customRatingCommentText: string;

    showHomeScreen: boolean;
    onSetShowHomeScreen: (show: boolean) => void;

    sttActive: boolean;

    showPrevConversationsScreen: boolean;
    onSetShowPrevConversationsScreen: (show: boolean) => void;
    prevConversations: PrevConversationsState;
}

interface WebchatUIState {
    theme: IWebchatTheme;
    messagePlugins: MessagePlugin[];
    inputPlugins: InputPlugin[];
    /* Initially false, true from the point of first connection */
    hadConnection: boolean;
    lastUnseenMessageText: string;
    wasOpen: boolean;
    timedOut: boolean;
}

const stylisPlugins = [
    isolate('[data-cognigy-webchat-root]')
];

/**
 * for RTL-layout websites, use the stylis-rtl plugin to convert CSS,
 * e.g. padding-left becomes padding-right etc.
 */
(() => {
    const dir = document.getElementsByTagName('html')[0].attributes['dir'];
    if (dir && dir.value === 'rtl') {
        stylisPlugins.push(stylisRTL);
    }
})();

const styleCache = createCache({
    key: 'cognigy-webchat',
    stylisPlugins
});

const HistoryWrapper = styled(History)(({ theme }) => ({
    overflowY: 'auto',
    flexGrow: 1,
    minHeight: 0,
    height: theme.blockSize
}));

export class WebchatUI extends React.PureComponent<React.HTMLProps<HTMLDivElement> & WebchatUIProps, WebchatUIState> {
    state = {
        theme: createWebchatTheme(),
        messagePlugins: [],
        inputPlugins: [],
        hadConnection: false,
        lastUnseenMessageText: "",
        wasOpen: false,
        timedOut: false
    };

    history: React.RefObject<ChatScroller>;
    chatToggleButtonRef: React.RefObject<HTMLButtonElement>;
    closeButtonInHeaderRef: React.RefObject<HTMLButtonElement>;
    ratingButtonInHeaderRef: React.RefObject<HTMLButtonElement>;
    webchatWindowRef: React.RefObject<HTMLDivElement>;

    private unreadTitleIndicatorInterval: ReturnType<typeof setInterval> | null = null;
    private originalTitle: string = window.document.title;
    private titleType: 'original' | 'unread' = 'original';
    private hideNotifications = true;
    private visibilityCheckInitialized = false;
    private visibilityCheckCompleted = false;

    private engagementMessageTimeout: ReturnType<typeof setTimeout> | null = null;

    constructor(props) {
        super(props);
        this.history = React.createRef();
        this.chatToggleButtonRef = React.createRef();
        this.closeButtonInHeaderRef = React.createRef();
        this.ratingButtonInHeaderRef = React.createRef();
        this.webchatWindowRef = React.createRef();
    }

    static getDerivedStateFromProps(props: WebchatUIProps, state: WebchatUIState): WebchatUIState | null {
        const color = props.config && props.config.settings && props.config.settings.colorScheme;

        if (!!color && color !== state.theme.primaryColor) {
            // We will integrate this into the theme object in the future
            // This is a demo of injecting a custom color scheme
            document.documentElement.style.setProperty('--webchat-primary-color', color);
            // This is example of how a new theme properties can be added
            // document.documentElement.style.setProperty('--webchat-background-bot-message', color);

            return {
                ...state,
                theme: createWebchatTheme({ primaryColor: color })
            }
        }

        return null;
    }

    private checkNotificationsHidden = async () => {
        let timeoutReached = false;
        if (this.props.config.settings.awaitEndpointConfig && !this.props.config.isConfigLoaded) {
            const timeout = this.props.config.settings.connectivity?.enabled && this.props.config.settings.connectivity?.timeout || 1000;
            let timeoutCounter = 0;
            while (!this.props.config.isConfigLoaded && !timeoutReached) {
                await new Promise(f => setTimeout(f, 50));
                timeoutCounter += 50;
                if (timeoutCounter >= timeout) {
                    timeoutReached = true;
                    this.setState({
                        timedOut: true
                    });
                }
            }
        }
        this.hideNotifications = isDisabledDueToConnectivity(this.props.config.settings, timeoutReached) ||
            isDisabledDueToMaintenance(this.props.config.settings) ||
            isDisabledOutOfBusinessHours(this.props.config.settings.businessHours) ||
            isInformingDueToConnectivity(this.props.config.settings, timeoutReached) ||
            isInformingDueToMaintenance(this.props.config.settings) ||
            isInformingOutOfBusinessHours(this.props.config.settings.businessHours) ||
            isHiddenDueToConnectivity(this.props.config.settings, timeoutReached) ||
            isHiddenDueToMaintenance(this.props.config.settings) ||
            isHiddenOutOfBusinessHours(this.props.config.settings.businessHours) || false;
    }

    componentDidMount() {
        this.setState({
            inputPlugins: [...this.props.inputPlugins || [], baseInputPlugin],
            messagePlugins: [...this.props.messagePlugins || [], regularMessagePlugin]
        });
    }

    async componentDidUpdate(prevProps: WebchatUIProps, prevState: WebchatUIState) {
        if (this.props.config.settings.colorScheme !== prevProps.config.settings.colorScheme) {
            this.setState({
                theme: createWebchatTheme({ primaryColor: this.props.config.settings.colorScheme })
            })
        }

        if (!prevState.hadConnection && this.props.connected) {
            this.setState({
                hadConnection: true
            })
        }

        if (!this.visibilityCheckInitialized) {
            this.visibilityCheckInitialized = true;
            await this.checkNotificationsHidden();
            this.visibilityCheckCompleted = true;
        }

        while (!this.visibilityCheckCompleted) {
            await new Promise(f => setTimeout(f, 50));
        }

        if (!this.hideNotifications && prevProps.unseenMessages !== this.props.unseenMessages
            || !prevProps.config.settings.enableUnreadMessagePreview && this.props.config.settings.enableUnreadMessagePreview) {
            const { unseenMessages } = this.props;

            // update the "unseen message preview" text
            if (this.props.config.settings.enableUnreadMessagePreview) {
                let lastUnseenMessageText = '';

                // find the last readable message and remember its text
                const lastReadableUnseenMessage = findReverse(
                    this.props.unseenMessages,
                    message => !!getTextFromMessage(message)
                );
                if (lastReadableUnseenMessage) {
                    lastUnseenMessageText = getTextFromMessage(lastReadableUnseenMessage);
                }

                this.setState({
                    lastUnseenMessageText
                });
            }

            // play a notification for unread messages
            if (unseenMessages.length > 0 && this.props.config.settings.enableUnreadMessageSound) {
                notificationSound.play();
            }
        }

        if (prevProps.config.settings.enableUnreadMessagePreview && !this.props.config.settings.enableUnreadMessagePreview) {
            this.setState({ lastUnseenMessageText: "" })
        }

        if (
            !this.hideNotifications
        ) {
            // initialize the title indicator if configured
            if (
                this.props.config.settings.enableUnreadMessageTitleIndicator
            ) {
                this.initializeTitleIndicator();
            }

            // initialize the engagement message if configured
            this.initializeEngagementMessage();

            if (this.props.open && !this.state.wasOpen) {
                this.setState({
                    wasOpen: true
                });
            }
        }
    }

    componentWillUnmount() {
        /**
         * this tears down the "unread messages" title indicator
         */
        if (this.unreadTitleIndicatorInterval) {
            clearInterval(this.unreadTitleIndicatorInterval);
            this.unreadTitleIndicatorInterval = null;
        }

        /**
         * this tears down the timeout for an "engagement message"
         */
        if (this.engagementMessageTimeout) {
            clearTimeout(this.engagementMessageTimeout);
            this.engagementMessageTimeout = null;
        }
    }

    /**
     * This triggers the engagement message in case the webchat
     * was not yet open and the history is empty
     */
    triggerEngagementMessage = () => {
        if (this.state.wasOpen || this.props.messages.length > 0)
            return;

        this.props.onTriggerEngagementMessage();
    }

    /**
     * This sets up the "engagement message" timeout.
     * It should only be registered once
     */
    initializeEngagementMessage = () => {
        if (this.engagementMessageTimeout)
            return;

        if (
            this.props.config.settings.engagementMessageText
            && typeof this.props.config.settings.engagementMessageDelay === 'number'
            && this.props.config.settings.engagementMessageDelay >= 0
        ) {
            this.engagementMessageTimeout = setTimeout(this.triggerEngagementMessage, this.props.config.settings.engagementMessageDelay);
        }
    }

    /**
     * This sets up the "unread messages" title indicator interval.
     * It should only be registered once!
     */
    initializeTitleIndicator = async () => {
        if (this.unreadTitleIndicatorInterval || this.hideNotifications)
            return;

        this.unreadTitleIndicatorInterval = setInterval(this.toggleTitleIndicator, 1000);
    }

    toggleTitleIndicator = () => {
        if (this.titleType === 'unread') {
            document.title = this.originalTitle;
            this.titleType = 'original';
        } else {
            if (this.props.unseenMessages.length > 0) {
                document.title = `(${this.props.unseenMessages.length}) ${(this.props.unseenMessages.length === 1) ? this.props.config.settings.unreadMessageTitleText : this.props.config.settings.unreadMessageTitleTextPlural}`;
                this.titleType = 'unread';
            }
        }
    }

    sendMessage: MessageSender = (...args) => {
        if (this.history.current) {
            this.history.current.handleScrollTo();
        }

        this.props.onSendMessage(...args);

        // we activate scrollToPosition functionality on first message
        if (this.props.lastScrolledPosition === null) {
            this.props.onSetLastScrolledPosition(0);
        }
    }

    renderInput = () => {
        const { inputPlugins } = this.state;

        return (
            <Input
                plugins={inputPlugins}
                messages={this.props.messages}
                onSendMessage={this.sendMessage}
                config={this.props.config}
                onSetInputMode={this.props.onSetInputMode}
                inputMode={this.props.inputMode}
                webchatTheme={this.state.theme}
                onEmitAnalytics={this.props.onEmitAnalytics}
                theme={this.state.theme}
                sttActive={this.props.sttActive}
            />
        );
    }

    // Key down handler
    handleKeydown = (event) => {
        const { enableFocusTrap } = this.props.config.settings;
        const { open } = this.props;
        const { target, key, shiftKey } = event;
        const shiftTabKeyPress = shiftKey && key === "Tab";
        const tabKeyPress = !shiftKey && key === "Tab";

        if (enableFocusTrap && open) {
            // Get the first and last focusable elements within the webchat window and add focus
            const webchatWindowEl = this.webchatWindowRef?.current as HTMLElement;
            const { firstFocusable, lastFocusable } = getKeyboardFocusableElements(webchatWindowEl);
            const chatToggleButton = this.chatToggleButtonRef?.current;

            /**
             * In order to trap focus, 
             * 
             * on Shift + Tab navigation, move the focus from first focusable element (located at the top-left of webchat)
             * or from the chat toggle, to the last focusable element (located at the bottom-right of webchat).
             * 
             * On Tab navigation, the focus should move from the last focusable element or from the chat toggle to the 
             * first focusable element within the chat window.
             * 
             */

            if ((target === chatToggleButton || target === firstFocusable) && shiftTabKeyPress) {
                event.preventDefault();
                // Focus the last focusable element
                lastFocusable?.focus();
            } else if ((target === chatToggleButton || target === lastFocusable) && tabKeyPress) {
                event.preventDefault();
                // Focus the first focusable element
                setTimeout(() => { firstFocusable?.focus(); }, 0);
            }
        }
    }

    handleSendRating = ({ rating, comment }) => {
        if (this.history.current) {
            this.history.current.handleScrollTo();
        }

        this.props.onSendMessage(
            undefined,
            {
                _cognigy: {
                    controlCommands: [
                        {
                            type: "setRating",
                            parameters: {
                                rating,
                                comment,
                            }
                        }
                    ]
                }
            },
            undefined,
        );

        this.props.onSetHasGivenRating();
        this.props.onShowRatingDialog(false);
    };

    render() {
        const { props, state } = this;
        const { messages,
            unseenMessages,
            prevConversations,
            onSendMessage,
            onConnect,
            config,
            open,
            fullscreenMessage,
            typingIndicator,
            onEmitAnalytics,
            onSetInputMode,
            onSetFullscreenMessage,
            onDismissFullscreenMessage,
            onClose,
            onToggle,
            onSetScrollToPosition,
            onSetLastScrolledPosition,
            scrollToPosition,
            lastScrolledPosition,
            onTriggerEngagementMessage,
            webchatRootProps,
            webchatToggleProps,
            connected,
            reconnectionLimit,
            hasGivenRating,
            showRatingDialog,
            onShowRatingDialog,
            onSetHasGivenRating,
            onSetShowHomeScreen,
            customRatingTitle,
            customRatingCommentText,
            ...restProps
        } = props;
        const { theme, hadConnection, lastUnseenMessageText } = state;

        const { disableToggleButton, enableConnectionStatusIndicator, ratingTitleText, ratingCommentText } = config.settings;

        if ((!this.props.config.active && !this.props.config.settings.connectivity.enabled) ||
            (!this.props.config.isConfigLoaded && this.props.config.settings.awaitEndpointConfig) ||
            (this.props.config.isConfigLoaded && this.props.config.settings.awaitEndpointConfig &&
                (isHiddenOutOfBusinessHours(this.props.config.settings.businessHours) ||
                    isHiddenDueToMaintenance(this.props.config.settings) ||
                    isHiddenDueToConnectivity(this.props.config.settings, this.state.timedOut)
                )))
            return null;

        const isDisabled = this.props.config.isConfigLoaded &&
            this.props.config.settings.awaitEndpointConfig &&
            (isDisabledDueToMaintenance(this.props.config.settings) ||
                isDisabledOutOfBusinessHours(this.props.config.settings.businessHours) ||
                isDisabledDueToConnectivity(this.props.config.settings, this.state.timedOut));

        const isInforming = this.props.config.isConfigLoaded &&
            this.props.config.settings.awaitEndpointConfig &&
            (isInformingDueToMaintenance(this.props.config.settings) ||
                isInformingOutOfBusinessHours(this.props.config.settings.businessHours) ||
                isInformingDueToConnectivity(this.props.config.settings, this.state.timedOut));

        const showDisconnectOverlay = enableConnectionStatusIndicator && !connected && hadConnection;

        const openChatAriaLabel = () => {

            switch (unseenMessages.length) {
                case 0:
                    return "Open chat";
                case 1:
                    return "One unread message in chat. Open chat";
                default:
                    return `${unseenMessages.length} unread messages in chat. Open chat`;
            }
        }

        const getDisabledMessage = () => {
            if (isDisabled &&
                isDisabledDueToMaintenance(this.props.config.settings)) {
                return this.props.config.settings.maintenance.text || "This chat is currently disabled due to maintenance";
            } else if (isDisabled &&
                isDisabledOutOfBusinessHours(this.props.config.settings.businessHours)) {
                return this.props.config.settings.maintenance.text || "This chat is disabled out of our business hours";
            } else if (isDisabled &&
                isDisabledDueToConnectivity(this.props.config.settings, this.state.timedOut)) {
                return this.props.config.settings.connectivity.text || "This chat is disabled due to connectivity issues";
            }
        }
        return (
            <>
                <ThemeProvider theme={theme}>
                    {/* <Global styles={cssReset} /> */}
                    <>
                        <WebchatWrapper
                            data-cognigy-webchat-root
                            {...restProps}
                            className="webchat-root"
                            aria-labelledby="webchatHeaderTitle"
                            role="region"
                            onKeyDown={this.handleKeydown}
                        >
                            <CacheProvider value={styleCache}>
                                {open &&
                                    (!this.props.config.settings.awaitEndpointConfig ||
                                        this.props.config.settings.awaitEndpointConfig &&
                                        this.props.config.isConfigLoaded)
                                    && (
                                        <WebchatRoot
                                            data-cognigy-webchat
                                            {...webchatRootProps}
                                            className="webchat"
                                            id="webchatWindow"
                                            ref={this.webchatWindowRef}
                                        >
                                            {!fullscreenMessage && !isInforming
                                                ? this.renderRegularLayout()
                                                : this.renderFullscreenMessageLayout()
                                            }
                                            {
                                                showRatingDialog &&
                                                <RatingDialog
                                                    onCloseRatingDialog={() => onShowRatingDialog(false)}
                                                    onSendRating={this.handleSendRating}
                                                    ratingTitleText={customRatingTitle || ratingTitleText}
                                                    ratingCommentText={customRatingCommentText || ratingCommentText}
                                                />
                                            }
                                            {showDisconnectOverlay && <DisconnectOverlay onConnect={onConnect} isPermanent={!!reconnectionLimit} onClose={onClose} />}
                                        </WebchatRoot>
                                    )}
                                {!disableToggleButton && (
                                    <div>
                                        {
                                            // Show the message teaser if there is a last bot message and the webchat is closed
                                            lastUnseenMessageText && (
                                                <UnreadMessagePreview
                                                    className="webchat-unread-message-preview"
                                                    onClick={onToggle}
                                                    aria-live="polite"
                                                >
                                                    <span className="sr-only">New message preview</span>
                                                    {lastUnseenMessageText}
                                                </UnreadMessagePreview>
                                            )
                                        }
                                        {isDisabled ?
                                            <div title={getDisabledMessage()} tabIndex={-1} aria-disabled>
                                                <FABDisabled
                                                    data-cognigy-webchat-toggle
                                                    {...webchatToggleProps}
                                                    type='button'
                                                    className="webchat-toggle-button-disabled"
                                                    aria-label={getDisabledMessage()}
                                                    ref={this.chatToggleButtonRef}
                                                    disabled
                                                >
                                                    <ChatIcon />
                                                </FABDisabled>
                                            </div>
                                            : <FAB
                                                data-cognigy-webchat-toggle
                                                onClick={onToggle}
                                                {...webchatToggleProps}
                                                type='button'
                                                className="webchat-toggle-button"
                                                aria-label={open ? "Close chat" : openChatAriaLabel()}
                                                ref={this.chatToggleButtonRef}
                                            >
                                                {open ? (
                                                    <CollapseIcon />
                                                ) : (
                                                    <ChatIcon />
                                                )}
                                                {
                                                    config.settings.enableUnreadMessageBadge ?
                                                        <Badge
                                                            content={unseenMessages.length}
                                                            className='webchat-unread-message-badge'
                                                            aria-label={`${unseenMessages.length} unread messages`}
                                                        />
                                                        :
                                                        null
                                                }
                                            </FAB>}
                                    </div>
                                )}
                            </CacheProvider>
                        </WebchatWrapper>
                    </>
                </ThemeProvider>
            </>
        )
    }

    renderRegularLayout() {
        const {
            config,
            hasGivenRating,
            onShowRatingDialog,
            messages,
            scrollToPosition,
            lastScrolledPosition,
            onSetScrollToPosition,
            onSetLastScrolledPosition,
            showHomeScreen,
            onSetShowHomeScreen,
            showPrevConversationsScreen,
            onSetShowPrevConversationsScreen,
            onClose,
            onEmitAnalytics,
        } = this.props;

        const { enableRating } = config.settings;

        const showRatingButton = enableRating && (enableRating === "always" || (enableRating === "once" && hasGivenRating === false));
        
        if (showHomeScreen) return (
            <HomeScreen
                showHomeScreen={showHomeScreen}
                onSetShowHomeScreen={onSetShowHomeScreen}
                onSetShowPrevConversationsScreen={onSetShowPrevConversationsScreen}
                onClose={onClose}
                config={config}
                onEmitAnalytics={onEmitAnalytics}
            />
        );

        const handleOnClose = () => {
            onSetShowPrevConversationsScreen(false);
            onSetShowHomeScreen(true);
        }

        return (
            <>
                <Header
                    onClose={handleOnClose}
                    connected={config.active}
                    logoUrl={config.settings.headerLogoUrl}
                    title={config.settings.title || "Cognigy Webchat"}
                    ratingButtonRef={this.ratingButtonInHeaderRef}
                    closeButtonRef={this.closeButtonInHeaderRef}
                    chatToggleButtonRef={this.chatToggleButtonRef}
                    showRatingButton={showRatingButton}
                    showCloseButton={true}
                    onRatingButtonClick={() => onShowRatingDialog(true)}
                />
                {showPrevConversationsScreen ? (
                    <PrevConversationsScreen
                        conversations={this.props.prevConversations}
                        onSetShowPrevConversationsScreen={onSetShowPrevConversationsScreen}
                        config={config}
                    />
                ) : (
                    <>
                {/* When we have common Header implemented, 
                we should move notifications container there  */}
                <Notifications />
                        <HistoryWrapper
                            disableBranding={config.settings.disableBranding}
                            scrollToPosition={scrollToPosition}
                            setScrollToPosition={onSetScrollToPosition}
                            lastScrolledPosition={lastScrolledPosition}
                            setLastScrolledPosition={onSetLastScrolledPosition}
                            ref={this.history as any}
                            className="webchat-chat-history"
                            tabIndex={messages?.length === 0 ? -1 : 0} // When no messages, remove chat history from tab order
                        >
                            <h2 className="sr-only" id="webchatChatHistoryHeading">
                                Chat History
                            </h2>
                            {this.renderHistory()}
                        </HistoryWrapper>
                        {this.renderInput()}
                    </>
                )}
            </>
        );
    }

    renderFullscreenMessageLayout() {
        const {
            config,
            fullscreenMessage,
            onDismissFullscreenMessage,
            onEmitAnalytics
        } = this.props;

        const { messagePlugins } = this.state;

        let message = fullscreenMessage as IMessage;

        if (config.settings.maintenance.enabled && config.settings.maintenance.mode === "inform") {
            message = {
                text: config.settings.maintenance.text || "This Webchat is disabled due to maintenance",
                data: {
                    _plugin: {
                        type: "full-screen-notification",
                        text: config.settings.maintenance.text,
                        data: {
                            title: config.settings.maintenance.title || "",
                            disableHtmlContentSanitization: config.settings.disableHtmlContentSanitization
                        }
                    }
                },
                source: "bot",
                traceId: ""
            }
        } else if (config.settings.connectivity.enabled && config.settings.connectivity.mode === "inform") {
            message = {
                text: config.settings.connectivity.text || "This Webchat is disabled due to connectivity issues",
                data: {
                    _plugin: {
                        type: "full-screen-notification",
                        text: config.settings.connectivity.text,
                        data: {
                            title: config.settings.connectivity.title || ""
                        }
                    }
                },
                source: "bot",
                traceId: ""
            }
        } else if (config.settings.businessHours.enabled && config.settings.businessHours.mode === "inform") {
            message = {
                text: config.settings.businessHours.text || "This Webchat is disabled out of business hours",
                data: {
                    _plugin: {
                        type: "full-screen-notification",
                        text: config.settings.businessHours.text,
                        data: {
                            title: config.settings.businessHours.title || ""
                        }
                    }
                },
                source: "bot",
                traceId: ""
            }
        }

        return (
            <FullScreenMessage
                onSendMessage={this.sendMessage}
                config={config}
                plugins={messagePlugins}
                onSetFullscreen={() => { }}
                onDismissFullscreen={onDismissFullscreenMessage}
                message={message}
                webchatTheme={this.state.theme}
                onEmitAnalytics={onEmitAnalytics}
            />
        )
    }

    renderHistory() {
        const { messages, typingIndicator, config, onEmitAnalytics, onSetScrollToPosition } = this.props;
        const { messagePlugins = [] } = this.state;

        const { enableTypingIndicator } = config.settings;
        const isTyping = typingIndicator !== 'remove' && typingIndicator !== 'hide';

        return (
            <>
                {messages.map((message, index) => (
                    <MessagePluginRenderer
                        key={index}
                        message={message}
                        prevMessage={messages?.[index - 1]}
                        onSendMessage={this.sendMessage}
                        setScrollToPosition={onSetScrollToPosition}
                        onSetFullscreen={() => this.props.onSetFullscreenMessage(message)}
                        onDismissFullscreen={() => { }}
                        config={config}
                        plugins={messagePlugins}
                        webchatTheme={this.state.theme}
                        onEmitAnalytics={onEmitAnalytics}
                    />
                ))}
                {enableTypingIndicator && (
                    <TypingIndicator active={isTyping} />
                )}
            </>
        )
    }
}