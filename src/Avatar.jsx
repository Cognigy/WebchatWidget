import { h } from 'preact';

/**
 * This method creates a chatbot avatar a given URL
 */
export function Avatar(props) {
	/* If we can load the logo image, then we use it. Otherwise we use the Cognigy logo */
	const imageUrl = props.messageLogoUrl || "https://s3.eu-central-1.amazonaws.com/cognigydev/CognigyWebchat/images/cognigy_logo.svg";

	return (
		<img
			className="cognigy-chat-bot-avatar"
			src={imageUrl}
			style={ props.style }
		/>
	)
}