import React from "react";
import styled from "@emotion/styled";
import { IWebchatConfig } from "../../../../common/interfaces/webchat-config";
import Branding from "../../branding/Branding";

const ChatOptionsRoot = styled.div(({ theme }) => ({
	height: "100%",
	width: "100%",
	fontSize: 16,
	fontWeight: 700,
	boxSizing: "border-box",
	backgroundColor: theme.backgroundWebchat,
	display: "flex",
	flexDirection: "column",
	"& *": {
		boxSizing: "border-box",
	},
}));


const ChatOptionsFooter = styled.div(({ theme }) => ({
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


interface IChatOptionsProps {
	config: IWebchatConfig;
}

export const ChatOptions = (props: IChatOptionsProps) => {
	const { config } = props;
    const disableBranding = config?.settings?.disableBranding;


	return (
		<ChatOptionsRoot className="webchat-prev-conversations-root">
			Chat optuons displayed here
			<ChatOptionsFooter className="webchat-prev-conversations-actions">
				{!disableBranding && <Branding />}
			</ChatOptionsFooter>
		</ChatOptionsRoot>
	);
};
