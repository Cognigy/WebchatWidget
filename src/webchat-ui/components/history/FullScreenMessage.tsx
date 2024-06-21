import { Message, MessageProps } from '@cognigy/chat-components';
import React from 'react';

const FullScreenMessageWithProps = (props: MessageProps) => (
    <Message
        {...props}
        isFullscreen={true}
    />
)

export default FullScreenMessageWithProps;