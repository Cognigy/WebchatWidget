import React from "react";
import styled from "@emotion/styled";
import ArrowIcon from "../../../assets/arrow-back-16px.svg";
import AvatarPlaceholder from "../../../assets/avatar-placeholder-50px.svg";
import Ellipsis from "../../../assets/ellipsis-4px.svg";
import { getAvatars, getLastMessagePreview, getParticipants, getRelativeTime } from "./helpers";
import { IWebchatConfig } from "../../../../common/interfaces/webchat-config";
import { PrevConversationsState } from "../../../../webchat/store/previous-conversations/previous-conversations-reducer";

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

const Left = styled.div(() => ({
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
	overflow: "hidden",
	textOverflow: "ellipsis",
	whiteSpace: "nowrap",
	maxWidth: "290px",
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

const Avatar = styled.img(({ theme }) => ({
	borderRadius: "50%",
	width: "28px",
	height: "28px",
	backgroundColor: theme.primaryColor,
	boxSizing: "border-box",
	border: `2px solid ${theme.white}`,
	overflow: "hidden",
	position: "relative",
	":not(:last-child)": {
		marginLeft: "-12px",
	},
}));

const FallBackAvatar = styled(AvatarPlaceholder)(({ theme }) => ({
	borderRadius: "50%",
	width: "28px",
	height: "28px",
	boxSizing: "border-box",
	border: `2px solid ${theme.white}`,
	"& rect": {
		fill: theme.primaryColor,
	},
}));

interface IConversationsListItemProps {
	config: IWebchatConfig;
	conversation: PrevConversationsState[string];
	sessionId: string;
	switchSession: (sessionId: string, conversation: PrevConversationsState[string]) => void;
}

export const ConversationsListItem = (props: IConversationsListItemProps) => {
	const { sessionId, conversation, config, switchSession } = props;

	const avatars = getAvatars(conversation.messages);

	const handleClick = () => {
		switchSession(sessionId, conversation);
	};

	return (
		<ListItem className="webchat-prev-conversations-item" onClick={handleClick}>
			<Left>
				{avatars.length > 0 ? (
					avatars.map((avatar, i) => {
						return <Avatar key={i} src={avatar} alt="Image avatar" />;
					})
				) : (
					<FallBackAvatar />
				)}
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
