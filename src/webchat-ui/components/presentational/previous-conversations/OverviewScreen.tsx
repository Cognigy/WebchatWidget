import React from 'react';
import styled from '@emotion/styled'
import { IWebchatConfig } from '../../../../common/interfaces/webchat-config';
import { ConversationsListItem } from './ConversationsListItem';

const ScreenRoot = styled.div(({theme}) => ({
	height: '100%',
	width: '100%',
	fontSize: 16,
	fontWeight: 700,
	boxSizing: 'border-box',
	backgroundColor: theme.white,
	'& *': {
		boxSizing: 'border-box',
	}
}));

const ScreenContent = styled.div(() => ({
	rowGap: '8px',
    display: 'grid',
    padding: '20px',
    overflowY: 'auto',
    "&:focus": {
        outline: "none",
    }
}));


interface IPreviousConversationsScreenProps {
	config: IWebchatConfig;
    conversations: any;
}

export const PreviousConversationsScreen = (props: IPreviousConversationsScreenProps) => {
    const { conversations } = props;

    const keys = Object.keys(conversations);

	return (
		<ScreenRoot className="webchat-homescreen-root">
			<ScreenContent className="webchat-homescreen-content">
                {keys.map((session, i) => {
					return <ConversationsListItem key={i} sessionId={session} conversation={conversations?.[session]} />
                })}
			</ScreenContent>
		</ScreenRoot>
	);
}