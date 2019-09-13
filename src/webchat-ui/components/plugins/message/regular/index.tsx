import * as React from 'react';
import { MessagePlugin, MessageComponentProps } from '../../../../../common/interfaces/message-plugin';
import MessageBubble from '../../../presentational/MessageBubble';

const RegularMessage = ({ message: { text, source } }: MessageComponentProps) => (
    <MessageBubble
        color={source === 'bot' ? 'primary' : 'default'}
        align={source === 'bot' ? 'left' : 'right'}
        dangerouslySetInnerHTML={{ __html: text || '' }}
        className={source === 'bot' ? 'webchat-chat-message-bot-text' : 'webchat-chat-message-user-text'}
    />
)

const regularMessagePlugin: MessagePlugin = {
    match: ({ text }) => !!text,
    component: RegularMessage
}

export default regularMessagePlugin;