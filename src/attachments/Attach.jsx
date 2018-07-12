import { Component, render, h } from "preact";
import ReactPlayer from 'react-player';

import { Avatar } from "../Avatar.jsx";
import Placeholder from './Placeholder.jsx';

class Attachment extends Component {
	constructor(props) {
		super(props);

		this.state = {
			imageUrl: null,
			validUrl: true
		};


		this.handleResourceErrored = this.handleResourceErrored.bind(this);
		this.handleResourceLoaded = this.handleResourceLoaded.bind(this);
	};

	componentWillMount() {
		/* If we can load the logo image, then we use it. Otherwise we use the Cognigy logo */
		const img = new Image();

		img.onload = () => {
			this.setState({ imageUrl: this.props.messageLogoUrl });
		}

		img.onerror = () => {
			this.setState({ imageUrl: "https://s3.eu-central-1.amazonaws.com/cognigydev/CognigyWebchat/images/cognigy_logo.svg" });
		}

		img.src = this.props.messageLogoUrl;
	}

	handleResourceLoaded(img) {
		this.setState({ validUrl: true, loadingResource: false });
	}


	handleResourceErrored(img) {
		this.setState({ validUrl: false, loadingResource: false });
	}

	render() {
		return (
			<div
				className="cognigy-chat-bot-message-container"
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "flex-end",
				}}
			>
				<Avatar
					style={{
						visibility: "visible",
						minWidth: 20,
						maxWidth: 20,
						marginBottom: 1
					}}
					imageUrl={this.state.imageUrl}
				/>

				<div
					style={{ width: "70%" }}
				>

					{
						this.props.type === 'image' &&
						(this.state.loadingResource || this.state.validUrl) &&
						<img
							src={this.props.url}
							style={{width: "100%", height: "auto", display: this.state.validUrl ? 'block' : 'none' }}
							onLoad={this.handleResourceLoaded}
							onError={this.handleResourceErrored}
						/>
					}
					{
						this.props.type === 'video' &&
						(this.state.loadingResource || this.state.validUrl) &&

						<div style={{ display: this.state.validUrl ? 'block' : 'none' }}>
							<ReactPlayer
								url={this.props.url}
								playing={true}
								controls={true}
								width='100%'
								height='150px'
								onReady={this.handleResourceLoaded}
								onError={this.handleResourceErrored}
							/>
						</div>
					}
					{
						this.props.type === 'audio' &&
						(this.state.loadingResource || this.state.validUrl) &&
						<div style={{ display: this.state.validUrl ? 'block' : 'none' }}>
							<ReactPlayer
								url={this.props.url}
								playing={true}
								controls={true}
								width='100%'
								height='50px'
								onReady={this.handleResourceLoaded}
								onError={this.handleResourceErrored}
							/>
						</div>
					}

					{!this.state.validUrl && <Placeholder type={this.props.type} />}
				</div>
			</div>
		)
	}
};

export default Attachment;