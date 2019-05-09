import * as React from 'react';
import TypingIndicator from './TypingIndicator';
import MessageBubble from './MessageBubble';

export default () => (
    <MessageBubble
        align='left'
        color='primary'
    >
        <TypingIndicator />
    </MessageBubble>
)