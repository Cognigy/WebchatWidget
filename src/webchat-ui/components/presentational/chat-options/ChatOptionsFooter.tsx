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

const Link = styled.a(({ theme }) => ({
	textDecoration: "none",
	color: theme.black10,

	"&:focus": {
		outline: "none",
		color: theme.primaryWeakColor,
	},
}));

const StyledFooterTypography = styled(Typography)(() => ({
	lineHeight: "19.6px",
	wordWrap: "break-word",
	margin: 0,
}));

// TODO: Get text and URL for the footer items from the config
export const ChatOptionsFooter = () => {
	const footerItem1Text = "Imprint";
	const footerItem2Text = "Data Protection";

	const footerItem1URL = "https://www.cognigy.com/legal-notice";
	const footerItem2URL = "https://www.cognigy.com/privacy-policy";

	return (
		<Footer className="webchat-chat-options-footer">
			<Link
				href={footerItem1URL}
				target="_blank"
				id="footer-text-1"
				aria-label={`${footerItem1Text}. Opens in new tab`}
			>
				<StyledFooterTypography variant="body-semibold">
					{footerItem1Text}
				</StyledFooterTypography>
			</Link>
			<Link
				href={footerItem2URL}
				target="_blank"
				id="footer-text-2"
				aria-label={`${footerItem2Text}. Opens in new tab`}
			>
				<StyledFooterTypography variant="body-semibold">
					{footerItem2Text}
				</StyledFooterTypography>
			</Link>
		</Footer>
	);
};
