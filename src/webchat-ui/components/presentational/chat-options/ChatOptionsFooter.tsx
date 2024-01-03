import React from "react";
import styled from "@emotion/styled";
import { Typography } from "@cognigy/chat-components";

const Footer = styled.div(({ theme }) => ({
	alignItems: " center",
	justifyContent: "center",
	padding: "12px 0px",
	gap: 24,
	width: "100%",
	display: "flex",
	backgroundColor: theme.backgroundWebchat,
	borderTop: `1px solid var(--basics-black-80, ${theme.black80})`,
}));

const StyledFooterTypography = styled(Typography)(() => ({
	lineHeight: "19.6px",
	wordWrap: "break-word",
	margin: 0,
}));

export const ChatOptionsFooter = () => {
	return (
		<Footer className="webchat-chat-options-footer">
			<StyledFooterTypography variant="body-semibold">Imprint</StyledFooterTypography>
			<StyledFooterTypography variant="body-semibold">Data Privacy</StyledFooterTypography>
		</Footer>
	);
};
