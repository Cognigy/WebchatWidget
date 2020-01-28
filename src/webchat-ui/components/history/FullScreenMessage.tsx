import * as React from 'react';
import { styled } from '../../style';

import Message, { MessageProps } from '../plugins/MessagePluginRenderer';

const FullscreenMessage = styled(Message)({
    flexGrow: 1,
    minHeight: 0
});

export default (props: MessageProps) => (
    // @ts-ignore
    <FullscreenMessage
        {...props}
        isFullscreen={true}
    />
)
