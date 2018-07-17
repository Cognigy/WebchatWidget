import { h, render, Component } from 'preact';

const containerStyle = {
	width: '100px',
	padding: 10,
	margin: '20px auto',
	backgroundColor: "#E0E0E0",
	borderRadius: 5
}

const IconStyle = {
	display: 'block',
	margin: 'auto',
	height: 48,
	width: 48,
	fill: 'grey'
}

class Placeholder extends Component {
	render(props) {

		let img;
		switch (props.type) {
			case "audio":
				img = "https://s3.eu-central-1.amazonaws.com/cognigydev/CognigyWebchat/images/audiotrack.svg";
				break;
			case "video":
				img = "https://s3.eu-central-1.amazonaws.com/cognigydev/CognigyWebchat/images/videocam.svg";
				break;
			case "image":
			default:
				img = "https://s3.eu-central-1.amazonaws.com/cognigydev/CognigyWebchat/images/camera-alt.svg";
				break;
		}

		return (
			<div style={containerStyle}>
				<img
					src={img}
					style={IconStyle}
				/>
			</div>
		);
	}
};

export default Placeholder;