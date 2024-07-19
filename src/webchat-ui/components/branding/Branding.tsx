import React, { FC, memo } from "react";
import styled from "@emotion/styled";
import { Typography } from "@cognigy/chat-components";
import { IWebchatSettings } from "../../../common/interfaces/webchat-config";

const Link = styled.a(({ theme }) => ({
	display: "flex",
	alignItems: "baseline",
	alignSelf: "center",
	width: "fit-content",
	height: 12,

	color: theme.textDark,

	textDecoration: "none",

	"&:focus, &:hover": {
		outline: "none",
		color: theme.primaryColor,
	},

	"&:focus-visible": {
		outline: `2px solid ${theme.primaryColor}`,
		outlineOffset: 2,
	},
}));

const Placeholder = styled.div(() => ({
}));

const URL = `https://www.cognigy.com/?utm_campaign=CognigyWebchatEmbedded&utm_medium=webchat&utm_term=webchat&utm_content=webchat&utm_source=${window.location.hostname}`;

interface IBrandingProps {
	id?: string;
	watermark?: IWebchatSettings["layout"]["watermark"];
	watermarkText?: string;
}

const Branding: FC<IBrandingProps> = (props) => {
	const { id, watermark, watermarkText } = props;

	if (watermark === "none") return (
		<Placeholder />
	);

	return (
		<Link
			href={URL}
			target="_blank"
			aria-label="Powered by Cognigy. Opens in new tab"
			id={id ?? "cognigyBrandingLink"}
		>
			<Typography variant="copy-medium" component="span" fontSize={10} lineHeight="120%">
				{(watermark === "custom" && watermarkText) ?
					watermarkText
					:
					"Powered by Cognigy.AI"
				}
			</Typography>
		</Link>
	);
}

export default memo(Branding, () => true);
