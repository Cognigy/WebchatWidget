import React, { memo } from "react";
import styled from "@emotion/styled";
import { Typography } from "@cognigy/chat-components";

const Link = styled.a(({ theme }) => ({
	display: "flex",
	alignItems: "baseline",
	justifyContent: "center",
	height: 12,

	color: theme.textDark,

	textDecoration: "none",

	"&:focus": {
		outline: "none",
		color: theme.primaryWeakColor,
		"#cognigyBrandingLogo": {
			"& path, & polygon": {
				fill: theme.primaryWeakColor,
			},
		},
	},
}));

const URL = `https://www.cognigy.com/?utm_campaign=CognigyWebchatEmbedded&utm_medium=webchat&utm_term=webchat&utm_content=webchat&utm_source=${window.location.hostname}`;

const Branding = () => (
	<Link
		href={URL}
		target="_blank"
		aria-label="Powered by Cognigy. Opens in new tab"
		id="cognigyBrandingLink"
	>
		<Typography variant="copy-medium" component="span" fontSize={10} lineHeight="120%">
			Powered by Cognigy.AI
		</Typography>
	</Link>
);

export default memo(Branding, () => true);
