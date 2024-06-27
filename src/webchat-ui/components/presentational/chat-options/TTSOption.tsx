import React from "react";
import styled from "@emotion/styled";
import { Typography } from "@cognigy/chat-components";
import { ToggleButton } from "../ToggleButton";

const TTSOptionRoot = styled.div(() => ({
	alignSelf: "stretch",
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	height: 50,
}));

interface ITTSOption {
	onToggle: () => void;
}

export const TTSOption = (props: ITTSOption) => {
	const { onToggle } = props;

	const [isActive, setIsActive] = React.useState(false);

	const handleToggle = () => {
		setIsActive(!isActive);
	}

	return (
		<TTSOptionRoot className="webchat-tts-option-root">
			<Typography variant="title1-semibold" margin={0} className="webchat-chat-options-tts-option-label">
				Enable text-to-Speech
			</Typography>
			<ToggleButton
				onClick={handleToggle}
				className="webchat-chat-options-tts-option-toggle"
				isActive={isActive}
			/>
		</TTSOptionRoot>
	)
}