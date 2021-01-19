import * as React from 'react';
import TypingIndicatorDots from './TypingIndicatorDots';
import MessageBubble from './MessageBubble';
import { styled } from '../../style';

const TypingIndicatorBubbleRoot = styled(MessageBubble)(({ theme }) => ({
    marginLeft: theme.unitSize * 4.5,
}));

export default () => (
    <TypingIndicatorBubbleRoot
        align='left'
        color='primary'
        className='webchat-typing-indicator'
    >
        <TypingIndicatorDots />
    </TypingIndicatorBubbleRoot>
)