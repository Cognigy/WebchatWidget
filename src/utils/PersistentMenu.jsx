/* Node modules */
import { h, Component, render } from 'preact';

/* Custom modules */
import { Helpers } from "../helpers.js";

/**
 * This method creates a persistent menu similar to the one on Facebook
 */
class PersistentMenu extends Component {
	constructor() {
		super();

		this.state = {
			openPersistentMenu: false
		}
	}

	handleMenuItemClick(title, payload) {
		/* Dispatch message event */
		const event = new CustomEvent("message",
			{ 
				detail: {
					payload,
					title,
					type: "postback"
				}
			}
		);
		window.dispatchEvent(event);

		/* Close the menu */
		this.setState({ openPersistentMenu: false });
	}

	render() {
		const { menuItems } = this.props;

		return (
			<div>
				<img
					className="cognigy-persistent-menu-button"
					src="https://s3.eu-central-1.amazonaws.com/cognigydev/CognigyWebchat/images/menuIcon.svg"
					onClick={() => this.setState({ openPersistentMenu: !this.state.openPersistentMenu })}
				/>

				{this.state.openPersistentMenu &&
					<div>
						<div className="cognigy-persistent-menu-container">
							<div className="cognigy-persistent-menu-title">
								<p>{this.props.title}</p>
							</div>

							{menuItems && menuItems.map((item, index) => (
								<div
									className="cognigy-persistent-menu-item"
									style={{
										/* Set a bottom border on all items except the last one */
										borderBottom: index !== (menuItems.length - 1) ? "1px solid #dddfe2" : null,
										color: document.webchatColor ? document.webchatColor : null
									}}
									onClick={() => this.handleMenuItemClick(item.title, item.payload)}
								>
									<p>{item.title}</p>
								</div>
							))}
						</div>
						<img
							src="https://s3.eu-central-1.amazonaws.com/cognigydev/CognigyWebchat/images/arrow_drop_down.svg"
							className="cognigy-persistent-menu-container-arrow"
						/>
					</div>
				}
			</div>
		)
	}
}

export default PersistentMenu;