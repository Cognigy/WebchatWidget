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
}

interface WebchatUIState {
    theme: IWebchatTheme;
    messagePlugins: MessagePlugin[];
    inputPlugins: InputPlugin[];
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
        inputPlugins: []
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

    componentDidUpdate(prevProps: WebchatUIProps) {
        if (this.props.config.settings.colorScheme !== prevProps.config.settings.colorScheme) {
            this.setState({
                theme: createWebchatTheme({ primaryColor: this.props.config.settings.colorScheme })
            })
        }

        if (this.props.messages !== prevProps.messages) {
            if (this.history.current) {
                this.history.current.scrollToBottom();
            }
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
            onSetInputMode,
            onSetFullscreenMessage,
            onDismissFullscreenMessage,
            ...restProps
        } = props;
        const { theme } = state;

        if (!this.props.config.active)
            return null;

        return (
            <>
                <ThemeProvider theme={theme}>
                    <>
                        {/* <Global styles={cssReset} /> */}
                        {open && (
                            <WebchatRoot data-cognigy-webchat-root {...restProps}>
                                <CacheProvider value={styleCache}>
                                    {!fullscreenMessage
                                        ? this.renderRegularLayout()
                                        : this.renderFullscreenMessageLayout()
                                    }
                                </CacheProvider>
                            </WebchatRoot>
                        )}
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
                    connected={config.active}
                    logoUrl={config.settings.headerLogoUrl}
                    title={config.settings.title || 'Cognigy Webchat'}
                    onClose={this.props.onClose}
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
            onDismissFullscreenMessage
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
            />
        )
    }

    getBotAvatar() {
        return this.props.config.settings.messageLogoUrl || defaultBotAvatar;
    }

    renderHistory() {
        const { messages, typingIndicator, config } = this.props;
        const { messagePlugins = [] } = this.state;

        return (
            <>
                {messages.map((message, index) => (
                    <MessagePluginRenderer
                        key={index}
                        message={message}
                        onSendMessage={this.sendMessage}
                        onSetFullscreen={() => this.props.onSetFullscreenMessage(message)}
                        onDismissFullscreen={() => {}}
                        config={config}
                        plugins={messagePlugins}
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