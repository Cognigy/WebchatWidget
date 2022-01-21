import * as React from 'react';
import { styled } from '../../style';

import Message, { MessageProps } from '../plugins/MessagePluginRenderer';

const FullScreenMessageRoot = styled(Message)({
    flexGrow: 1,
    minHeight: 0
});

const FullScreenMessage: React.FC<MessageProps> = (props) => (
    <FullScreenMessageRoot
        {...props}
        isFullscreen={true}
    />
);

export default FullScreenMessage;
