import * as React from 'react';
import { IMessage } from '../../../common/interfaces/message';
import { styled } from '../../style';
import { ChatScroller } from './ChatScroller';
import { IWebchatConfig } from '@cognigy/webchat-client/lib/interfaces/webchat-config';
import { MessagePlugin } from '../../../common/interfaces/message-plugin';
import { MessageSender } from '../../interfaces';


export const History = styled(ChatScroller)(({ theme }) => ({
    paddingTop: theme.unitSize * 2,
    paddingBottom: theme.unitSize * 2
}));