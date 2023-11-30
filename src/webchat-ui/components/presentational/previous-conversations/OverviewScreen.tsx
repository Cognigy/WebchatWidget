import React from "react";
import styled from "@emotion/styled";
import { IWebchatConfig } from "../../../../common/interfaces/webchat-config";
import { ConversationsListItem } from "./ConversationsListItem";
import PrimaryButton from "../PrimaryButton";
import { PreviousConversationsState } from "../../../../webchat/store/previous-conversations/previous-conversations-reducer";
import Branding from "../../branding/Branding";

const ScreenRoot = styled.div(({ theme }) => ({
	height: "100%",
	width: "100%",
	fontSize: 16,
	fontWeight: 700,
	boxSizing: "border-box",
	backgroundColor: theme.white,
	display: "flex",
	flexDirection: "column",
	"& *": {
		boxSizing: "border-box",
	},
}));

const ScreenContent = styled.div(({theme}) => ({
	rowGap: "8px",
	display: "flex",
	flexDirection: "column",
	padding: "20px",
	overflowY: "auto",
	flexGrow: 1,
	minHeight: 0,
    height: theme.blockSize,
	"&:focus": {
		outline: "none",
	},
}));

const ScreenActions = styled.div(({ theme }) => ({
	alignSelf: 'flex-end',
	display: 'flex',
	flexDirection: 'column',
	alignItems: ' center',
	justifyContent: 'center',
	width: '100%',
	padding: "20px 20px 12px 20px",
	backgroundColor: theme.backgroundWebchat,
	borderTop: `1px solid var(--basics-black-80, ${theme.black80})`
}));

const StartButton = styled(PrimaryButton)(() => ({
	marginBottom: 20,
	flexGrow: 1,
}));

interface IPreviousConversationsScreenProps {
	config: IWebchatConfig;
	conversations: PreviousConversationsState;
	onSetShowPreviousConversationsScreen: (show: boolean) => void;
}

export const PreviousConversationsScreen = (props: IPreviousConversationsScreenProps) => {
	const { conversations, config, onSetShowPreviousConversationsScreen } = props;

	const disableBranding = config?.settings?.disableBranding;

	const keys = Object.keys(conversations);

	const handleStartButtonClick = () => {
		onSetShowPreviousConversationsScreen(false);
	};

	return (
		<ScreenRoot className="webchat-homescreen-root">
			<ScreenContent className="webchat-homescreen-content">
				{keys.map((session, i) => {
					return (
						<ConversationsListItem
							key={i}
							sessionId={session}
							conversation={conversations?.[session]}
							config={config}
						/>
					);
				})}
			</ScreenContent>
			<ScreenActions className="webchat-homescreen-actions">
				<StartButton
					onClick={handleStartButtonClick}
					className="webchat-homescreen-send-button"
					aria-label="Start chat"
				>
					Start conversation
				</StartButton>
				{!disableBranding && <Branding />}
			</ScreenActions>
		</ScreenRoot>
	);
};
