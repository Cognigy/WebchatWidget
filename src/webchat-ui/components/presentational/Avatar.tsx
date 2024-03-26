import React, { CSSProperties } from "react";
import styled from "@emotion/styled";

const getBackgroundImage = (url: string) => {
	if (!url) return undefined;

	const escapedUrl = url
		// remove line breaks
		.replace(/\n/g, "")
		.replace(/\r/g, "")
		// escape " and \
		.replace(/\"\\/g, char => `\${char}`);

	return `url("${escapedUrl}")`;
};

interface IAvatarProps {
	src: string;
}

export default styled.div<IAvatarProps>(({ theme, src }) => ({
	borderRadius: 20,
	height: theme.unitSize * 3,
	width: theme.unitSize * 3,
	border: `1px solid ${theme.greyWeakColor}`,
	backgroundImage: getBackgroundImage(src),
	backgroundSize: "cover",
	backgroundPosition: "center center",
	backgroundRepeat: "no-repeat",
}));
