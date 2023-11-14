import React from 'react';
import styled from '@emotion/styled';

import Message, { MessageProps } from '../plugins/MessagePluginRenderer';

const FullscreenMessage = styled(Message)({
    flexGrow: 1,
    minHeight: 0
});

const FullScreenMessageWithProps = (props: MessageProps) => (
    <FullscreenMessage
        {...props}
        isFullscreen={true}
    />
)

export default FullScreenMessageWithProps;