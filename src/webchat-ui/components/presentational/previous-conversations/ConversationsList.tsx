import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { IWebchatConfig } from "../../../../common/interfaces/webchat-config";
import { ConversationsListItem } from "./ConversationsListItem";
import PrimaryButton from "../PrimaryButton";
import { PrevConversationsState } from "../../../../webchat/store/previous-conversations/previous-conversations-reducer";
import Branding from "../../branding/Branding";
import { sortConversationsByFreshness } from "./helpers";

const ConversationsListRoot = styled.div(({ theme }) => ({
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

const ConversationsList = styled.div(({ theme }) => ({
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

const ConversationsListActions = styled.div(({ theme }) => ({
	alignSelf: "flex-end",
	display: "flex",
	flexDirection: "column",
	alignItems: " center",
	justifyContent: "center",
	width: "100%",
	padding: "20px 20px 12px 20px",
	backgroundColor: theme.white,
	borderTop: `1px solid var(--basics-black-80, ${theme.black80})`,
}));

const StartButton = styled(PrimaryButton)(() => ({
	marginBottom: 20,
	flexGrow: 1,
}));

interface IPrevConversationsListProps {
	config: IWebchatConfig;
	conversations: PrevConversationsState;
	onSetShowPrevConversations: (show: boolean) => void;
	onSwitchSession: (sessionId?: string, conversation?: PrevConversationsState[string]) => void;
}

export const PrevConversationsList = (props: IPrevConversationsListProps) => {
	const { conversations, config, onSetShowPrevConversations, onSwitchSession } = props;

	// we sort the conversation based on last message timestamp
	// result: the last updated conversation goes on top
	const sortedConversations = sortConversationsByFreshness(conversations);

	const sessions = Object.keys(sortedConversations);

	const handleStartButtonClick = () => {
		// we initialize a new session
		onSwitchSession();
		onSetShowPrevConversations(false);
	};

	const switchSession = useCallback(
		(sessionId?: string, conversation?: PrevConversationsState[string]) => {
			onSwitchSession(sessionId, conversation);
			onSetShowPrevConversations(false);
		},
		[],
	);

	return (
		<ConversationsListRoot className="webchat-prev-conversations-root">
			<ConversationsList className="webchat-prev-conversations-content">
				{sessions.length > 0 &&
					sessions.map((session, i) => {
						return (
							<ConversationsListItem
								key={i}
								sessionId={session}
								switchSession={switchSession}
								conversation={sortedConversations[session]}
								config={config}
							/>
						);
					})}
			</ConversationsList>
			<ConversationsListActions className="webchat-prev-conversations-actions">
				<StartButton
					onClick={handleStartButtonClick}
					className="webchat-prev-conversations-send-button"
					aria-label="Start chat"
				>
					Start new conversation
				</StartButton>
				<Branding
					id="cognigyConversationListBranding"
					watermark={config?.settings?.layout?.watermark}
					watermarkText={config?.settings?.layout?.watermarkText}
				/>
			</ConversationsListActions>
		</ConversationsListRoot>
	);
};
