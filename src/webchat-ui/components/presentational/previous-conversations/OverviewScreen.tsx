import React from "react";
import styled from "@emotion/styled";
import { IWebchatConfig } from "../../../../common/interfaces/webchat-config";
import { ConversationsListItem } from "./ConversationsListItem";
import PrimaryButton from "../PrimaryButton";
import { PrevConversationsState } from "../../../../webchat/store/previous-conversations/previous-conversations-reducer";
import Branding from "../../branding/Branding";
import { sortConversationsByFreshness } from "./helpers";

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

const ScreenContent = styled.div(({ theme }) => ({
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
	alignSelf: "flex-end",
	display: "flex",
	flexDirection: "column",
	alignItems: " center",
	justifyContent: "center",
	width: "100%",
	padding: "20px 20px 12px 20px",
	backgroundColor: theme.backgroundWebchat,
	borderTop: `1px solid var(--basics-black-80, ${theme.black80})`,
}));

const StartButton = styled(PrimaryButton)(() => ({
	marginBottom: 20,
	flexGrow: 1,
}));

interface IPrevConversationsScreenProps {
	config: IWebchatConfig;
	conversations: PrevConversationsState;
	onSetShowPrevConversationsScreen: (show: boolean) => void;
	onSwitchSession: (sessionId: string, conversation: PrevConversationsState[string]) => void;
}

export const PrevConversationsScreen = (props: IPrevConversationsScreenProps) => {
	const { conversations, config, onSetShowPrevConversationsScreen, onSwitchSession } = props;

	const disableBranding = config?.settings?.disableBranding;

	// we sort the conversation based on last message timestamp
	// result: the last updated conversation goes on top
	const sortedConversations = sortConversationsByFreshness(conversations);

	const sessions = Object.keys(sortedConversations);

	const handleStartButtonClick = () => {
		onSetShowPrevConversationsScreen(false);
	};

	return (
		<ScreenRoot className="webchat-prev-conversations-root">
			<ScreenContent className="webchat-prev-conversations-content">
				{sessions.map((session, i) => {
					return (
						<ConversationsListItem
							key={i}
							sessionId={session}
							switchSession={onSwitchSession}
							startConversation={handleStartButtonClick}
							conversation={sortedConversations[session]}
							config={config}
						/>
					);
				})}
			</ScreenContent>
			<ScreenActions className="webchat-prev-conversations-actions">
				<StartButton
					onClick={handleStartButtonClick}
					className="webchat-prev-conversations-send-button"
					aria-label="Start chat"
				>
					Start conversation
				</StartButton>
				{!disableBranding && <Branding />}
			</ScreenActions>
		</ScreenRoot>
	);
};
