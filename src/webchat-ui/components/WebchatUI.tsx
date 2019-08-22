import * as React from 'react';
import { css, Global } from '@emotion/core';
import { IMessage } from '../../common/interfaces/message';
import Header from './presentational/Header';
import { IWebchatConfig } from '@cognigy/webchat-client/lib/interfaces/webchat-config';
import { ThemeProvider } from 'emotion-theming';
import { CacheProvider } from '@emotion/core';
import { IWebchatTheme, createWebchatTheme, styled } from '../style';
import WebchatRoot from './presentational/WebchatRoot';
import { History } from './history/History';
import createCache from '@emotion/cache';
import { isolate } from '../utils/css';
import { MessagePlugin } from '../../common/interfaces/message-plugin';
import FullScreenMessage from './history/FullScreenMessage';
import Input from './plugins/InputPluginRenderer';
import textInputPlugin from './plugins/input/text';
import MessageRow from './presentational/MessageRow';
import Avatar from './presentational/Avatar';
import MessagePluginRenderer from './plugins/MessagePluginRenderer';
import regularMessagePlugin from './plugins/message/regular';
import { InputPlugin } from '../../common/interfaces/input-plugin';

import TypingIndicatorBubble from './presentational/TypingIndicatorBubble';
import '../utils/normalize.css';
import { MessageSender } from '../interfaces';
import { ChatScroller } from './history/ChatScroller';
import FAB from './presentational/FAB';
import WebchatWrapper from './presentational/WebchatWrapper';
import ChatIcon from '../assets/baseline-chat-24px.svg';
import CloseIcon from '../assets/baseline-close-24px.svg';
import DisconnectOverlay from './presentational/DisconnectOverlay';

export interface WebchatUIProps {
    messages: IMessage[];
    fullscreenMessage?: IMessage;
    onSetFullscreenMessage: (message: IMessage) => void;
    onDismissFullscreenMessage: () => void;

    onSendMessage: MessageSender;
    config: IWebchatConfig;
    typingIndicator: boolean;

    open: boolean;

    messagePlugins?: MessagePlugin[];
    inputPlugins: InputPlugin[];

    inputMode: string;
    onSetInputMode: (inputMode: string) => void;
    onClose: () => void;
    onToggle: () => void;

    onEmitAnalytics: (event: string, payload?: any) => void;

    webchatRootProps?: React.ComponentProps<typeof WebchatRoot>;
    webchatToggleProps?: React.ComponentProps<typeof FAB>;

    connected: boolean;
}

interface WebchatUIState {
    theme: IWebchatTheme;
    messagePlugins: MessagePlugin[];
    inputPlugins: InputPlugin[];
    /* Initially false, true from the point of first connection */
    hadConnection: boolean; 
}

const styleCache = createCache({
    key: 'cognigy-webchat',
    stylisPlugins: [
        isolate('[data-cognigy-webchat-root]'),
    ]
});

const HistoryWrapper = styled(History)(({ theme }) => ({
    overflowY: 'auto',
    flexGrow: 1,
    minHeight: 0,
    height: theme.blockSize
}));

export const defaultBotAvatar = "https://s3.eu-central-1.amazonaws.com/cognigydev/CognigyWebchat/images/cognigy_logo.svg"
export const defaultUserImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAACOklEQVR4Ae3ZA2ydURwF8P9s2+bjPSdGo0aN08V+URtbL+a8BbO9xfZs2zaCuW7vbDx8uLfp/3dinw+XopRSSimllFJhYm9TjV08wwdoYB0f8ix2mDkTe0p7YIZxDeto/5I6rjHDxGtdkcc72n8H75CXruKn1CAcpi0cHE4NEv9kp+EubXHB3ew08QuH4hFt8cGj5Ajxx9hePE1bYi6k+4gvMJ+29GCe+CEzhvW0ZaQ+PVZ8wDW0ZWatuJfozrqyC9Qluotr2Sra8pOtEtewMkgBrBLXsC9QgX3iGm4EKnBDXOP7QAXeiWt4G6jAW3ENNwMVuCmu4UCgAgc6/DCqE1miO9+7X0oEgtVlF1gjPkiOKHs5Pbx9b2jme7SlxPmSC5we20v8kRjJh6Vt6jlU/JKZztsBj1XcH2zxGG3h4ERqkPgp0R35AhvMOuQT3cVnyRH/O9wt4zjLzaj00/F6/dfj9WrPj9eVUkqpRPeMMTnMxxbu4fWf5uP3uME93IZ5JpcxHi4lzGjWYgPPsom2cNDIs9jAWjNaXJvaw1RyES/SlpmLXGQqHb0Rgsv5hjaEvOJyIt6lWg4nacMNTppcHMu9LqYGL2ijCZ6bGuki0TEVuEIbbXDFVEgU2JsbaWPKRvYOf6C8SBtjLoY6yKbH4h5tvMHd5DgJR6Ivb9E6yK1EX6c3AMGDlRIcZtG6i5ktQWGpywJYKkHxgtMC5yUo1tM6TL0ERes2WkALaAEtEEm0gFJKKaWUUkp9ABvn3SEbw3cFAAAAAElFTkSuQmCC"

export class WebchatUI extends React.PureComponent<React.HTMLProps<HTMLDivElement> & WebchatUIProps, WebchatUIState> {
    state = {
        theme: createWebchatTheme(),
        messagePlugins: [],
        inputPlugins: [],
        hadConnection: false
    };

    history: React.RefObject<ChatScroller>;

    constructor(props) {
        super(props);

        this.history = React.createRef();
    }

    static getDerivedStateFromProps(props: WebchatUIProps, state: WebchatUIState): WebchatUIState | null {
        const color = props.config && props.config.settings && props.config.settings.colorScheme;

        if (!!color && color !== state.theme.primaryColor) {
            return {
                ...state,
                theme: createWebchatTheme({ primaryColor: color })
            }
        }

        return null;
    }

    componentDidMount() {
        this.setState({
            inputPlugins: [...this.props.inputPlugins || [], textInputPlugin],
            messagePlugins: [...this.props.messagePlugins || [], regularMessagePlugin]
        });
    }

    componentDidUpdate(prevProps: WebchatUIProps, prevState: WebchatUIState) {
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
    }

    sendMessage: MessageSender = (...args) => {
        if (this.history.current) {
            this.history.current.scrollToBottom();
        }

        this.props.onSendMessage(...args);
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
            />
        );
    }

    render() {
        const { props, state } = this;
        const { messages,
            onSendMessage,
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
            webchatRootProps,
            webchatToggleProps,
            connected,
            ...restProps
        } = props;
        const { theme, hadConnection } = state;

        const { disableToggleButton, enableConnectionStatusIndicator } = config.settings;

        if (!this.props.config.active)
            return null;

        const showDisconnectOverlay =  enableConnectionStatusIndicator && !connected && hadConnection;

        return (
            <>
                <ThemeProvider theme={theme}>
                    {/* <Global styles={cssReset} /> */}
                    <>
                        <WebchatWrapper data-cognigy-webchat-root {...restProps}>
                            <CacheProvider value={styleCache}>
                                {open && (
                                    <WebchatRoot
                                        data-cognigy-webchat
                                        {...webchatRootProps}
                                    >
                                        {!fullscreenMessage
                                            ? this.renderRegularLayout()
                                            : this.renderFullscreenMessageLayout()
                                        }
                                        {showDisconnectOverlay && <DisconnectOverlay />}
                                    </WebchatRoot>
                                )}
                                {!disableToggleButton && (
                                    <FAB
                                        data-cognigy-webchat-toggle
                                        onClick={onToggle}
                                        {...webchatToggleProps}
                                        type='button'
                                    >
                                        {open ? (
                                            <CloseIcon />
                                        ) : (
                                                <ChatIcon />
                                            )}
                                    </FAB>
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
            messages,
            typingIndicator
        } = this.props;

        return (
            <>
                <Header
                    onClose={this.props.onClose}
                    connected={config.active}
                    logoUrl={config.settings.headerLogoUrl}
                    title={config.settings.title || 'Cognigy Webchat'}
                />
                <HistoryWrapper ref={this.history as any}>
                    {this.renderHistory()}
                </HistoryWrapper>
                {this.renderInput()}
            </>
        )
    }

    renderFullscreenMessageLayout() {
        const {
            config,
            fullscreenMessage,
            onDismissFullscreenMessage,
            onEmitAnalytics
        } = this.props;

        const { messagePlugins } = this.state;

        return (
            <FullScreenMessage
                onSendMessage={this.sendMessage}
                config={config}
                plugins={messagePlugins}
                onSetFullscreen={() => { }}
                onDismissFullscreen={onDismissFullscreenMessage}
                message={fullscreenMessage as IMessage}
                webchatTheme={this.state.theme}
                onEmitAnalytics={onEmitAnalytics}
            />
        )
    }

    getBotAvatar() {
        return this.props.config.settings.messageLogoUrl || defaultBotAvatar;
    }

    renderHistory() {
        const { messages, typingIndicator, config, onEmitAnalytics } = this.props;
        const { messagePlugins = [] } = this.state;

        return (
            <>
                {messages.map((message, index) => (
                    <MessagePluginRenderer
                        key={index}
                        message={message}
                        onSendMessage={this.sendMessage}
                        onSetFullscreen={() => this.props.onSetFullscreenMessage(message)}
                        onDismissFullscreen={() => { }}
                        config={config}
                        plugins={messagePlugins}
                        webchatTheme={this.state.theme}
                        onEmitAnalytics={onEmitAnalytics}
                    />
                ))}
                {typingIndicator && (
                    <MessageRow align='left'>
                        <Avatar src={this.getBotAvatar()} />
                        <TypingIndicatorBubble />
                    </MessageRow>
                )}
            </>
        )
    }
}