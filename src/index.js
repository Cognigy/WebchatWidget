"use strict";

//Function to create html elements
var createElement = function createElement(type, className, id) {
	var element = document.createElement(type);
	element.className = className;
	if (id) {
		element.id = id;
	}

	return element;
};

var mainChatElement = document.getElementById("cognigy");
var outerContainer = createElement("div", "cognigy-outer-container__closed", "cognigy-outer-container");
var toggleChatState = createElement("div", "cognigy-chat-state-closed", "cognigy-toggle-state");
toggleChatState.onclick = handleChatOpen;
mainChatElement.append(outerContainer);
mainChatElement.append(toggleChatState);

//Create standard header with text
var headerContainer = createElement("div", "cognigy-chat-header-container__open", "cognigy-header");
var header = createElement("div", "cognigy-chat-header");

//Create header title and subtitle
var headerText = createElement("div", "cognigy-header-text");
var headerTitle = createElement("span", "cognigy-header-title");
var headerSubtitle = createElement("span", "cognigy-header-subtitle");
headerTitle.append(document.createTextNode("Cognigy"));
headerSubtitle.append(document.createTextNode("Online"));
headerText.append(headerTitle);
headerText.append(headerSubtitle);

//Create bot avatar with Cognigy logo and append to header
var avatar = createElement("img", "cognigy-header-avatar");
avatar.src = "./images/cognigy_avatar.svg";
avatar.id = "cognigyHeaderLogo";
header.append(avatar);

header.append(headerText);
headerContainer.append(header);
outerContainer.append(headerContainer);

//Create chatContainer
var chatContainer = createElement("div", "cognigy-chat-container", "cognigy-container");
outerContainer.append(chatContainer);

//Create chatForm with input, send button, record button and record toggle button
var chatForm = createElement("form", "cognigy-chat-form", "cognigy-form");
outerContainer.append(chatForm);

var chatInput = createElement("input", "cognigy-chat-input", "cognigy-input");
chatInput.placeholder = "Write a reply";
chatForm.append(chatInput);

var chatButton = createElement("button", "cognigy-chat-button", "cognigy-button");
chatButton.type = "submit";
var sendAvatar = createElement("img", "cognigy-send-icon");
sendAvatar.src = "./images/send.svg";
chatButton.append(sendAvatar);
chatForm.append(chatButton);

var recordToggleButton = createElement("button", "cognigy-record-toggle-button", "cognigy-record-toggle");
recordToggleButton.onclick = function () {
	return handleRecordToggle();
};
recordToggleButton.type = "button";
var recordToggleAvatar = createElement("img", "cognigy-record-toggle-icon");
recordToggleAvatar.src = "./images/mic_off.svg";
recordToggleButton.append(recordToggleAvatar);
chatForm.append(recordToggleButton);

var recordButton = createElement("button", "displayNone", "cognigy-record");
recordButton.type = "button";
chatForm.prepend(recordButton);

var recordToggled = false;
function handleRecordToggle() {
	recordToggled = !recordToggled;

	if (recordToggled) {
		recordToggleAvatar.src = './images/mic_on.svg';
		//Change input to mic button
		chatInput.className = "displayNone";
		chatForm.style.justifyContent = "center";
		recordButton.className = "cognigy-record-button";
	} else {
		//Change from mic button to text input
		recordToggleAvatar.src = "./images/mic_off.svg";
		recordButton.className = "displayNone";
		chatInput.className = "cognigy-chat-input";
	}
}

function handleChatOpen() {
	var toggleChatState = document.getElementById("cognigy-toggle-state");
	var chatContainer = document.getElementById("cognigy-outer-container");
	var chatHeader = document.getElementById("cognigy-header");

	if (toggleChatState.className === "cognigy-chat-state-closed") {
		chatContainer.className = "cognigy-outer-container__open";
		toggleChatState.className = "cognigy-chat-state-open";
	} else {
		chatContainer.className = "cognigy-outer-container__closed";
		toggleChatState.className = "cognigy-chat-state-closed";
	}
}

function handleSendMessage(e) {
	e.preventDefault();
	//Get the value from input, then create two divs to store/display the message
	var inputValue = document.getElementById("cognigy-input").value;
	var chatContainer = document.getElementById("cognigy-container");
	var messageContainer = document.createElement("div");
	var message = document.createElement("div");
	var messageValue = document.createTextNode(inputValue);
	message.className = "cognigy-chat-user-message";
	messageContainer.className = "cognigy-chat-user-message-container";
	message.append(messageValue);
	messageContainer.append(message);

	//Create user avatar and append to message contanier
	var avatar = document.createElement("img");
	avatar.className = "cognigy-chat-user-avatar";
	avatar.src = "./images/user_avatar.jpg";
	messageContainer.append(avatar);

	chatContainer.append(messageContainer);
	//Keep scrollbar fixed at bottom when new messages are added
	chatContainer.scrollTop = chatContainer.scrollHeight;
}

//Add event listener for form submit event
var formElement = document.getElementById("cognigy-form");
formElement.addEventListener("submit", function (e) {
	return handleSendMessage(e);
}, false);

function handleDisplayRecording(transcript) {
	var chatContainer = document.getElementById("cognigy-container");
	var messageContainer = document.createElement("div");
	var message = document.createElement("div");
	var messageValue = document.createTextNode(transcript);
	message.className = "cognigy-chat-user-message";
	messageContainer.className = "cognigy-chat-user-message-container";
	message.append(messageValue);
	messageContainer.append(message);

	//Create user avatar and append to message contanier
	var avatar = document.createElement("img");
	avatar.className = "cognigy-chat-user-avatar";
	avatar.src = "./images/user_avatar.jpg";
	messageContainer.append(avatar);

	chatContainer.append(messageContainer);
	//Keep scrollbar fixed at bottom when new messages are added
	chatContainer.scrollTop = chatContainer.scrollHeight;
}

function handleDisplayPostbackMessage(text) {
	var chatContainer = document.getElementById("cognigy-container");
	var messageContainer = document.createElement("div");
	var message = document.createElement("div");
	var messageValue = document.createTextNode(text);
	message.className = "cognigy-chat-user-message";
	messageContainer.className = "cognigy-chat-user-message-container";
	message.appendChild(messageValue);
	messageContainer.appendChild(message);

	//Create user avatar and append to message contanier
	var avatar = document.createElement("img");
	avatar.className = "cognigy-chat-user-avatar";
	avatar.src = "./images/user_avatar.jpg";
	messageContainer.appendChild(avatar);

	chatContainer.appendChild(messageContainer);
	//Keep scrollbar fixed at bottom when new messages are added
	chatContainer.scrollTop = chatContainer.scrollHeight;
}

function displayCognigyMessage(answerFromCognigy, logoUrl) {
	if (!answerFromCognigy) return null;
	var cognigyAnswer = answerFromCognigy && answerFromCognigy.text;
	var chatContainer = document.getElementById("cognigy-container");

	if (typeof cognigyAnswer !== 'undefined') {
		var messageContainer = document.createElement("div");
		var message = document.createElement("div");
		var messageValue = document.createTextNode(cognigyAnswer);

		//Create bot avatar with Cognigy logo and append to message contanier
		var _avatar = createElement("img", "cognigy-chat-bot-avatar");

		/* If we can load the logo image, then we use it. Otherwise we use the Cognigy logo */
		var img = new Image();
		img.onload = function () {
			_avatar.src = logoUrl;
		};
		img.onerror = function () {
			_avatar.src = "./images/cognigy_logo.svg";
		};
		img.src = logoUrl;

		messageContainer.append(_avatar);

		// Append message to UI
		message.className = "cognigy-chat-bot-message";
		messageContainer.className = "cognigy-chat-bot-message-container";
		message.append(messageValue);
		messageContainer.append(message);

		chatContainer.append(messageContainer);
	}

	//Display Facebook message
	if (answerFromCognigy && answerFromCognigy.data && (answerFromCognigy.data.facebook || answerFromCognigy.data._cognigy && answerFromCognigy.data._cognigy._facebook)) {
		var renderRichMessage = new RichMessages(answerFromCognigy.data, chatContainer);
		renderRichMessage.renderMessage();
	}
	//Keep scrollbar fixed at bottom when new messages are added
	chatContainer.scrollTop = chatContainer.scrollHeight;
}