import {
	MessageComponentProps,
	MessageMatcher,
} from "../../../../common/interfaces/message-plugin";

const processedMessageIds = new Set<string>();

const match: MessageMatcher = ({ text, source }) =>
	source === "bot" || (source === "engagement" && !!text);

const SpeechOutput = (props: MessageComponentProps) => {
	if (!window || !window.speechSynthesis) {
		return null;
	}

	const id = props.message.timestamp + "";

	if (processedMessageIds.has(id)) {
		return null;
	}

	processedMessageIds.add(id);

	const utterance = new SpeechSynthesisUtterance();
	utterance.text = props.message.text || "";
	speechSynthesis.speak(utterance);

	return null;
};

const speechOutput = {
	match,
	component: SpeechOutput,
	options: {
		passthrough: true,
	},
	name: "SpeechOutput",
};

// No need to register the plugin.
// It's conditionally included in the WebchatUI.tsx

export default speechOutput;
