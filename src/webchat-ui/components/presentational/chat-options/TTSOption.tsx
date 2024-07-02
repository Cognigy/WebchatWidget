import React from "react";
import styled from "@emotion/styled";
import { Typography } from "@cognigy/chat-components";
import { ToggleButton } from "../ToggleButton";
import { IWebchatConfig } from "../../../../common/interfaces/webchat-config";
import { useSelector } from "../../../../webchat/helper/useSelector";

const TTSOptionRoot = styled.div(() => ({
	alignSelf: "stretch",
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	height: 50,
}));

interface ITTSOption {
	config: IWebchatConfig;
	onToggle: () => void;
}

const TTSOption = (props: ITTSOption) => {
	const { config, onToggle } = props;

	const isActive = useSelector(state => state.ui.ttsActive);
	

	return (
		<TTSOptionRoot className="webchat-tts-option-root">
			<Typography variant="title1-semibold" margin={0} className="webchat-chat-options-tts-option-label">
				{ config.settings.chatOptions.labelTTSToggle || "Enable Text-to-Speech" }
			</Typography>
			<ToggleButton
				onClick={onToggle}
				className="webchat-chat-options-tts-option-toggle"
				isActive={isActive}
			/>
		</TTSOptionRoot>
	)
}

export default TTSOption;