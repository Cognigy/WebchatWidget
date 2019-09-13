import * as React from 'react';
import { IMessage } from '../../../common/interfaces/message';
import { MessagePlugin } from '../../../common/interfaces/message-plugin';
import { MessageSender } from '../../interfaces';
import { IWebchatConfig } from '@cognigy/webchat-client/lib/interfaces/webchat-config';
import { getPluginsForMessage } from '../../../plugins/helper';
import MessageRow from '../presentational/MessageRow';
import Avatar from '../presentational/Avatar';
import { defaultBotAvatar, defaultUserImg } from '../WebchatUI';
import { styled, IWebchatTheme } from '../../style';

export interface MessageProps extends React.HTMLProps<HTMLDivElement> {
    message: IMessage;
    config: IWebchatConfig;
    onSendMessage: MessageSender;
    onSetFullscreen?: () => void;
    onDismissFullscreen?: () => void;
    onEmitAnalytics: (name: string, payload?: any) => void;
    plugins: MessagePlugin[];
    isFullscreen?: boolean;
    webchatTheme: IWebchatTheme;
}

const FullWidthMessageRow = styled.div(({ theme }) => ({
    marginTop: theme.unitSize,
    marginBottom: theme.unitSize,
    paddingTop: theme.unitSize,
    paddingBottom: theme.unitSize
}))

export default ({ message, config, onSendMessage, plugins, isFullscreen, onSetFullscreen, onDismissFullscreen, webchatTheme, onEmitAnalytics, ...props }: MessageProps): JSX.Element => {
    const attributes = Object.keys(props).length > 0
        ? props
        : undefined;

    const avatarImg = message.source === 'bot'
        ? config.settings.messageLogoUrl || defaultBotAvatar
        : defaultUserImg;

    const matchedPlugins = getPluginsForMessage(plugins)(message);

    return (
        <>
            {matchedPlugins.map(({ component: Component, options, name = 'unknown' }, index) => {
                const emitAnalytics = (event: string, payload?: any) => onEmitAnalytics(`plugin/${name}/${event}`, payload);

                const messageElement = (
                    <Component
                        key={index}
                        config={config}
                        message={message}
                        onSendMessage={onSendMessage}
                        onSetFullscreen={onSetFullscreen}
                        onDismissFullscreen={onDismissFullscreen}
                        attributes={attributes}
                        isFullscreen={isFullscreen}
                        theme={webchatTheme}
                        onEmitAnalytics={emitAnalytics}
                    />
                );

                const key = `${index}:${JSON.stringify(message)}`;

                if (isFullscreen) {
                    return messageElement;
                }

                if (options && options.fullwidth) {
                    return (
                        <FullWidthMessageRow
                            key={key}
                        >
                            {messageElement}
                        </FullWidthMessageRow>
                    )
                }


                return (
                    <MessageRow
                        key={key}
                        align={message.source === 'bot' ? 'left' : 'right'}
                        className={message.source === 'bot' ? 'webchat-chat-message-bot': 'webchat-chat-message-user'}
                    >
                        <Avatar src={avatarImg}
                        className={message.source === 'bot'? 'webchat-chat-message-bot-avatar': 'webchat-chat-message-user-avatar'}
                        />
                        {messageElement}
                    </MessageRow>
                )
            })}
        </>
    );
}