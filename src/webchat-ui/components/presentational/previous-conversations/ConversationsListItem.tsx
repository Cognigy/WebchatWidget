import React from "react";
import styled from "@emotion/styled";
import ArrowIcon from "../../../assets/arrow-back-16px.svg";
import Ellipsis from "../../../assets/ellipsis-4px.svg";
import { getLastMessagePreview, getParticipants, getRelativeTime } from "./helpers";
import { IWebchatConfig } from "../../../../common/interfaces/webchat-config";
import { PreviousConversationsState } from "../../../../webchat/store/previous-conversations/previous-conversations-reducer";

const ListItem = styled.div(({ theme }) => ({
	display: "flex",
	gap: "12px",
	height: "69px",
	width: "100%",
	border: `1px solid ${theme.black80}`,
	borderRadius: "10px",
	padding: "12px",
	cursor: "pointer",
	justifyContent: "space-between",
	alignItems: "center",
}));

const Left = styled.div(({ theme }) => ({
	display: "inline-flex",
	flexDirection: "row-reverse",
}));

const Center = styled.div(() => ({
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
	width: "100%",
	height: "100%",
}));

const CenterTitle = styled.div(({ theme }) => ({
	color: theme.black10,
	fontSize: "14px",
	fontStyle: "normal",
	fontWeight: 400,
	lineHeight: "140%",
}));

const CenterMeta = styled.div(({ theme }) => ({
	color: theme.black10,
	fontSize: "12px",
	fontStyle: "normal",
	fontWeight: 400,
	lineHeight: "140%",
	display: "flex",
	gap: "8px",
	alignItems: "center",
}));

const MetaNames = styled.span(() => ({}));

const MetaTime = styled.span(({ theme }) => ({
	color: theme.black40,
}));

const Right = styled.div(({ theme }) => ({
	svg: {
		transform: "rotate(180deg)",
	},
	"svg path": {
		fill: theme.black10,
	},
}));

const Avatar = styled.img(() => ({
	borderRadius: "50%",
	width: "28px",
	height: "28px",
	backgroundColor: "var(--primary-color)",
	boxSizing: "border-box",
	border: "2px solid #fff",
	overflow: "hidden",
	position: "relative",
	":not(:last-child)": {
		marginLeft: "-12px",
	},
}));

interface IConversationsListItemProps {
    config: IWebchatConfig;
	conversation: PreviousConversationsState[string];
	sessionId: string;
}

export const ConversationsListItem = (props: IConversationsListItemProps) => {
	const { sessionId, conversation, config } = props;

	const handleClick = () => {
		console.log(sessionId, conversation);
	};

	const getAvatars = messages => {
		const countBots = messages.filter(obj => obj.source === "bot").length;
		const countAgents = messages.filter(obj => obj.source === "agent").length;
		console.log(countBots, countAgents);
		return [avatar, avatar];
	};

	const getNames = messages => {
		return ["Cognigy", "Christian"].join(", ");
	};

	const avatar =
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAACOklEQVR4Ae3ZA2ydURwF8P9s2+bjPSdGo0aN08V+URtbL+a8BbO9xfZs2zaCuW7vbDx8uLfp/3dinw+XopRSSimllFJhYm9TjV08wwdoYB0f8ix2mDkTe0p7YIZxDeto/5I6rjHDxGtdkcc72n8H75CXruKn1CAcpi0cHE4NEv9kp+EubXHB3ew08QuH4hFt8cGj5Ajxx9hePE1bYi6k+4gvMJ+29GCe+CEzhvW0ZaQ+PVZ8wDW0ZWatuJfozrqyC9Qluotr2Sra8pOtEtewMkgBrBLXsC9QgX3iGm4EKnBDXOP7QAXeiWt4G6jAW3ENNwMVuCmu4UCgAgc6/DCqE1miO9+7X0oEgtVlF1gjPkiOKHs5Pbx9b2jme7SlxPmSC5we20v8kRjJh6Vt6jlU/JKZztsBj1XcH2zxGG3h4ERqkPgp0R35AhvMOuQT3cVnyRH/O9wt4zjLzaj00/F6/dfj9WrPj9eVUkqpRPeMMTnMxxbu4fWf5uP3uME93IZ5JpcxHi4lzGjWYgPPsom2cNDIs9jAWjNaXJvaw1RyES/SlpmLXGQqHb0Rgsv5hjaEvOJyIt6lWg4nacMNTppcHMu9LqYGL2ijCZ6bGuki0TEVuEIbbXDFVEgU2JsbaWPKRvYOf6C8SBtjLoY6yKbH4h5tvMHd5DgJR6Ivb9E6yK1EX6c3AMGDlRIcZtG6i5ktQWGpywJYKkHxgtMC5yUo1tM6TL0ERes2WkALaAEtEEm0gFJKKaWUUkp9ABvn3SEbw3cFAAAAAElFTkSuQmCC";

	return (
		<ListItem className="webchat-homescreen-content" onClick={handleClick}>
			<Left>
				{getAvatars(conversation.messages).map((avatar, i) => {
					return <Avatar key={i} src={avatar} />;
				})}
			</Left>
			<Center>
				<CenterTitle>{getLastMessagePreview(conversation.messages)}</CenterTitle>
				<CenterMeta>
					<MetaNames>{getParticipants(conversation.messages, config)}</MetaNames>
					<Ellipsis />
					<MetaTime>{getRelativeTime(conversation.messages)}</MetaTime>
				</CenterMeta>
			</Center>
			<Right>
				<ArrowIcon />
			</Right>
		</ListItem>
	);
};
