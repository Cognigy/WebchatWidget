/** @jsx h */
// @flow
import { h, render, } from 'preact';
import { Avatar } from "./Avatar.jsx";

const { RichMessages } = require("./rich-messages-source.js");

class Helpers {
	typingStatusBuffer: Array<string>;
	enableTypingIndicator: boolean;
	messageLogoUrl: string;
	isProcessingTypingStatus: boolean;

	constructor() {
		this.typingStatusBuffer = [];
	}

	handleChatOpen = () => {
		var toggleChatState = document.getElementById("cognigy-toggle-state");
		var toggleMobileChatState = document.getElementById("cognigy-toggle-state-mobile");
		var chatContainer = document.getElementById("cognigy-outer-container");
		var chatHeader = document.getElementById("cognigy-header");
		if (toggleChatState && chatContainer && toggleMobileChatState && toggleChatState.className === "cognigy-chat-state-closed") {
			chatContainer.className = "cognigy-outer-container__open";
			toggleChatState.className = "cognigy-chat-state-open";
			toggleMobileChatState.className = "cognigy-mobile-open";
		} else if (chatContainer && toggleChatState && toggleMobileChatState) {
			chatContainer.className = "cognigy-outer-container__closed";
			toggleChatState.className = "cognigy-chat-state-closed";
			toggleMobileChatState.className = "displayNone";
		}
	}

	handleSendMessage = (e: any) => {
		if (e) {
			e.preventDefault ? e.preventDefault() : (e.returnValue = false);
		}

		if (this.enableTypingIndicator) {
			this.handleTypingStatus("typingOff");
		}

		//Get the value from input, then create two divs to store/display the message
		const inputEl = ((document.getElementById("cognigy-input"): any): HTMLInputElement);
		var inputValue = inputEl.innerHTML;
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
		var avatar = document.createElement("div");
		avatar.className = "cognigy-chat-user-avatar";
		messageContainer.appendChild(avatar);

		chatContainer && chatContainer.appendChild(messageContainer);
		//Keep scrollbar fixed at bottom when new messages are added
		if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;

		if (this.enableTypingIndicator) {
			this.handleTypingStatus("typingOn");
		}
	}


	handleDisplayRecording = (transcript: any) => {
		var chatContainer = document.getElementById("cognigy-container");
		var messageContainer = document.createElement("div");
		var message = document.createElement("div");
		var messageValue = document.createTextNode(transcript);
		message.className = "cognigy-chat-user-message";
		messageContainer.className = "cognigy-chat-user-message-container";
		message.appendChild(messageValue);
		messageContainer.appendChild(message);

		//Create user avatar and appendChild to message contanier
		var avatar = document.createElement("div");
		avatar.className = "cognigy-chat-user-avatar";
		messageContainer.appendChild(avatar);

		chatContainer && chatContainer.appendChild(messageContainer);
		//Keep scrollbar fixed at bottom when new messages are added
		if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
	}

	handleDisplayPostbackMessage = (text: string) => {
		if (typeof text !== "string") return null;
		var chatContainer = document.getElementById("cognigy-container");
		var messageContainer = document.createElement("div");
		var message = document.createElement("div");
		var messageValue = document.createTextNode(text.replace(/&nbsp;/g, ""));
		message.className = "cognigy-chat-user-message";
		messageContainer.className = "cognigy-chat-user-message-container";
		message.appendChild(messageValue);
		messageContainer.appendChild(message);

		//Create user avatar and append to message contanier
		var avatar = document.createElement("div");
		avatar.className = "cognigy-chat-user-avatar";
		messageContainer.appendChild(avatar);

		chatContainer && chatContainer.appendChild(messageContainer);
		//Keep scrollbar fixed at bottom when new messages are added
		if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
	}

	displayCognigyMessage = (answerFromCognigy: any, messageLogoUrl: any, readCognigyMessage: any, handleCognigyMessage: any) => {
		if (!answerFromCognigy || (!answerFromCognigy.text && !answerFromCognigy.data)) return null;

		var cognigyAnswer = answerFromCognigy && answerFromCognigy.text;
		var chatContainer = document.getElementById("cognigy-container");

		//Display Facebook message if it is there. Otherwise display normal message
		if (answerFromCognigy && answerFromCognigy.data && answerFromCognigy.data._cognigy && answerFromCognigy.data._cognigy._webchat) {
			var renderRichMessage = new RichMessages(answerFromCognigy.data._cognigy._webchat, chatContainer, readCognigyMessage, this.handleDisplayPostbackMessage, handleCognigyMessage, messageLogoUrl, this.displayCognigyMessage);
			renderRichMessage.renderMessage();

		} else if (answerFromCognigy && answerFromCognigy.data && answerFromCognigy.data._cognigy && answerFromCognigy.data._cognigy._facebook) {
			var renderRichMessage = new RichMessages(answerFromCognigy.data._cognigy._facebook, chatContainer, readCognigyMessage, this.handleDisplayPostbackMessage, handleCognigyMessage, messageLogoUrl, this.displayCognigyMessage);
			renderRichMessage.renderMessage();
		} else if (cognigyAnswer) {
			var messageContainer = document.createElement("div");
			var message = document.createElement("div");
			var messageValue = document.createTextNode(cognigyAnswer);

			//Create bot avatar with Cognigy logo and append to message contanier
			var _avatar = ((this.createElement("img", "cognigy-chat-bot-avatar"): any): HTMLImageElement);

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
			message.innerHTML = cognigyAnswer;
			if ((document: any).webchatColor) {
				message.style.backgroundColor = (document: any).webchatColor;
			}
			messageContainer.appendChild(message);

			chatContainer && chatContainer.appendChild(messageContainer);
		}

		//Keep scrollbar fixed at bottom when new messages are added
		if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;

		readCognigyMessage(cognigyAnswer);
	}

	/* Function to handle the getStartedButton */
	handleGetStartedButton = (getStartedText: string, getStartedPostback: any, handleCognigyMessage: any) => {
		/* Send getStarted text to Cognigy and display it in the webchat */
		this.handleDisplayPostbackMessage(getStartedText);
		handleCognigyMessage(getStartedPostback);

		/* Display form and hide getStartedButton */
		const cognigyForm = ((document.getElementById("cognigy-form"):any): HTMLFormElement);
		cognigyForm.className = "cognigy-chat-form";
		const buttonEl = ((document.getElementById("cognigy-get-started-button"): any): HTMLButtonElement);
		buttonEl.className = "displayNone";
	}

	createElement = (type: string, className: string, id?: string) => {
		var element = document.createElement(type);
		element.className = className;
		if (id) {
			element.id = id;
		}

		return element;
	};

	handleTypingStatus = async (status: string) => {
		if (this.isProcessingTypingStatus) {
			this.typingStatusBuffer.push(status);
			return;
		}

		this.isProcessingTypingStatus = true;

		const chatContainer = document.getElementById("cognigy-container");

		if (status === "typingOn") {
			if (document.getElementById("cognigy_typing_indicator")) {
				this.isProcessingTypingStatus = false;
				return;
			}

			await new Promise(resolve => window.setTimeout(resolve, 300));

			const typingIndicatorContainer = document.createElement("div");
			const typingIndicator = document.createElement("div");
			typingIndicator.className = "cognigy-chat-bot-message cognigy-typing-indicator";
			typingIndicatorContainer.className = "cognigy-chat-bot-message-container";
			typingIndicatorContainer.id = "cognigy_typing_indicator";

			if ((document: any).webchatColor) {
				typingIndicator.style.backgroundColor = (document: any).webchatColor;
			}
	
			const span1 = document.createElement("span");
			typingIndicator.appendChild(span1);
			const span2 = document.createElement("span");
			typingIndicator.appendChild(span2);
			const span3 = document.createElement("span");
			typingIndicator.appendChild(span3);

			render(
				<Avatar
					imageUrl={this.messageLogoUrl}
				/>,
				typingIndicatorContainer);

			typingIndicatorContainer.appendChild(typingIndicator);

			chatContainer && chatContainer.appendChild(typingIndicatorContainer);
			
		} else if (status === "typingOff") {
			const typingIndicator = document.getElementById("cognigy_typing_indicator");
			if (typingIndicator) {
				(typingIndicator: any).parentNode.removeChild(typingIndicator);
			}
		}

		//Keep scrollbar fixed at bottom when new messages are added
		if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;

		this.isProcessingTypingStatus = false;

		if (this.typingStatusBuffer.length > 0) {
			this.handleTypingStatus(this.typingStatusBuffer.shift());
		}
	} 
}

module.exports = {
	Helpers: new Helpers
}