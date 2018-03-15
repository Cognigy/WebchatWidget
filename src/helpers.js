const { RichMessages } = require("./rich-messages-source.js");

class Helpers {
	handleChatOpen = () => {
		var toggleChatState = document.getElementById("cognigy-toggle-state");
		var toggleMobileChatState = document.getElementById("cognigy-toggle-state-mobile");
		var chatContainer = document.getElementById("cognigy-outer-container");
		var chatHeader = document.getElementById("cognigy-header");
		if (toggleChatState.className === "cognigy-chat-state-closed") {
			chatContainer.className = "cognigy-outer-container__open";
			toggleChatState.className = "cognigy-chat-state-open";
			toggleMobileChatState.className = "cognigy-mobile-close";
		} else {
			chatContainer.className = "cognigy-outer-container__closed";
			toggleChatState.className = "cognigy-chat-state-closed";
			toggleMobileChatState.className = "displayNone";
		}
	}

	handleSendMessage = (e) => {
		if (e)
			e.preventDefault ? e.preventDefault() : (e.returnValue = false);
		//Get the value from input, then create two divs to store/display the message
		var inputValue = document.getElementById("cognigy-input").innerHTML;
		var replaceNonBreakableSpace = new RegExp(String.fromCharCode(160), "g");
		inputValue = inputValue.replace(/<br>/g, "\n")
			.replace(/&nbsp;/g, "");
		var chatContainer = document.getElementById("cognigy-container");
		var messageContainer = document.createElement("div");
		var message = document.createElement("div");
		var messageValue = document.createTextNode(inputValue);
		message.className = "cognigy-chat-user-message";
		messageContainer.className = "cognigy-chat-user-message-container";
		message.appendChild(messageValue);
		messageContainer.appendChild(message);

		//Create user avatar and appendChild to message contanier
		var avatar = document.createElement("img");
		avatar.className = "cognigy-chat-user-avatar";
		avatar.src = "https://s3.eu-central-1.amazonaws.com/cognigydev/CognigyWebchat/images/user_avatar.jpg";
		messageContainer.appendChild(avatar);

		chatContainer.appendChild(messageContainer);
		//Keep scrollbar fixed at bottom when new messages are added
		chatContainer.scrollTop = chatContainer.scrollHeight;
	}


	handleDisplayRecording = (transcript) => {
		var chatContainer = document.getElementById("cognigy-container");
		var messageContainer = document.createElement("div");
		var message = document.createElement("div");
		var messageValue = document.createTextNode(transcript);
		message.className = "cognigy-chat-user-message";
		messageContainer.className = "cognigy-chat-user-message-container";
		message.appendChild(messageValue);
		messageContainer.appendChild(message);

		//Create user avatar and appendChild to message contanier
		var avatar = document.createElement("img");
		avatar.className = "cognigy-chat-user-avatar";
		avatar.src = "https://s3.eu-central-1.amazonaws.com/cognigydev/CognigyWebchat/images/user_avatar.jpg";
		messageContainer.appendChild(avatar);

		chatContainer.appendChild(messageContainer);
		//Keep scrollbar fixed at bottom when new messages are added
		chatContainer.scrollTop = chatContainer.scrollHeight;
	}

	handleDisplayPostbackMessage = (text) => {
		var chatContainer = document.getElementById("cognigy-container");
		var messageContainer = document.createElement("div");
		var message = document.createElement("div");
		var messageValue = document.createTextNode(text.replace(/&nbsp;/g, ""));
		message.className = "cognigy-chat-user-message";
		messageContainer.className = "cognigy-chat-user-message-container";
		message.appendChild(messageValue);
		messageContainer.appendChild(message);

		//Create user avatar and append to message contanier
		var avatar = document.createElement("img");
		avatar.className = "cognigy-chat-user-avatar";
		avatar.src = "https://s3.eu-central-1.amazonaws.com/cognigydev/CognigyWebchat/images/user_avatar.jpg";
		messageContainer.appendChild(avatar);

		chatContainer.appendChild(messageContainer);
		//Keep scrollbar fixed at bottom when new messages are added
		chatContainer.scrollTop = chatContainer.scrollHeight;
	}

	displayCognigyMessage = (answerFromCognigy, messageLogoUrl, readCognigyMessage, handleCognigyMessage) => {
		if (!answerFromCognigy || answerFromCognigy.text === "") return null;
		var cognigyAnswer = answerFromCognigy && answerFromCognigy.text;
		var chatContainer = document.getElementById("cognigy-container");

		//Display Facebook message if it is there. Otherwise display normal message
		if (answerFromCognigy && answerFromCognigy.data && (answerFromCognigy.data.facebook || answerFromCognigy.data._cognigy && answerFromCognigy.data._cognigy._facebook)) {
			var renderRichMessage = new RichMessages(answerFromCognigy.data, chatContainer, readCognigyMessage, this.handleDisplayPostbackMessage, handleCognigyMessage, messageLogoUrl, this.displayCognigyMessage);
			renderRichMessage.renderMessage();
		} else if (typeof cognigyAnswer !== 'undefined') {
			var messageContainer = document.createElement("div");
			var message = document.createElement("div");
			var messageValue = document.createTextNode(cognigyAnswer);

			//Create bot avatar with Cognigy logo and append to message contanier
			var _avatar = this.createElement("img", "cognigy-chat-bot-avatar");

			/* If we can load the logo image, then we use it. Otherwise we use the Cognigy logo */
			var img = new Image();
			img.onload = function () {
				_avatar.src = messageLogoUrl;
			};
			img.onerror = function () {
				_avatar.src = "https://s3.eu-central-1.amazonaws.com/cognigydev/CognigyWebchat/images/cognigy_logo.svg";
			};
			img.src = messageLogoUrl;

			messageContainer.appendChild(_avatar);

			// appendChild message to UI
			message.className = "cognigy-chat-bot-message";
			messageContainer.className = "cognigy-chat-bot-message-container";
			message.appendChild(messageValue);
			messageContainer.appendChild(message);

			chatContainer.appendChild(messageContainer);
		}

		//Keep scrollbar fixed at bottom when new messages are added
		chatContainer.scrollTop = chatContainer.scrollHeight;

		readCognigyMessage(cognigyAnswer);
	}

	/* Function to handle the getStartedButton */
	handleGetStartedButton = (getStartedText, getStartedPostback, handleCognigyMessage) => {
		/* Send getStarted text to Cognigy and display it in the webchat */
		this.handleDisplayPostbackMessage(getStartedText);
		handleCognigyMessage(getStartedPostback);

		/* Display form and hide getStartedButton */
		document.getElementById("cognigy-form").className = "cognigy-chat-form";
		document.getElementById("cognigy-get-started-button").className = "displayNone";
	}

	createElement = (type, className, id) => {
		var element = document.createElement(type);
		element.className = className;
		if (id) {
			element.id = id;
		}

		return element;
	};
}

module.exports = {
	Helpers: new Helpers
}