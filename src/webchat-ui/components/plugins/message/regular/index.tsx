import * as React from 'react';
import { MessagePlugin, MessageComponentProps } from '../../../../../common/interfaces/message-plugin';
import MessageBubble from '../../../presentational/MessageBubble';

const className = (source: string) => {
    switch (source) {
        case 'bot':
            return 'regular-message bot';
        case 'user':
            return  'regular-message user';
        case 'agent':
            return  'regular-message agent';
        default:
            break;
    }
}

const RegularMessage = ({ message: { text, source } }: MessageComponentProps) => (
    <MessageBubble
        color={(source === 'bot' || source === 'agent') ? 'primary' : 'default'}
        align={(source === 'bot' || source === 'agent')? 'left' : 'right'}
        dangerouslySetInnerHTML={{ __html: text || '' }}
        className={className(source)}
    />
)

const regularMessagePlugin: MessagePlugin = {
    match: ({ text }) => !!text,
    component: RegularMessage
}

export default regularMessagePlugin;