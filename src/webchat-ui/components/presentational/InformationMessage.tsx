import React from "react";
import styled from "@emotion/styled";
import { Typography } from "@cognigy/chat-components";
import InfoMessageSVG from "../../assets/infoMessageIcon.svg";

const MessageRoot = styled.div(({ theme }) => ({
	height: "100%",
	width: "100%",
	backgroundColor: theme.white,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
}));

const Message = styled.div(() => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	flexDirection: "column",
	gap: "24px",
	maxWidth: "295px",
	textAlign: "center",
}));

interface IInformationMessageProps {
	message: string;
}

export const InformationMessage = (props: IInformationMessageProps) => {
	const { message } = props;

	return (
		<MessageRoot className="webchat-information-message-root">
			<Message className="webchat-information-message-content">
				<InfoMessageSVG />
				<Typography variant="title1-regular">
					{message}
				</Typography>
			</Message>
		</MessageRoot>
	);
};
