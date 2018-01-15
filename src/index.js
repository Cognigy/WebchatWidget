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
mainChatElement.appendChild(outerContainer);
mainChatElement.appendChild(toggleChatState);

//Create standard header with text
var headerContainer = createElement("div", "cognigy-chat-header-container__open", "cognigy-header");
var header = createElement("div", "cognigy-chat-header");

//Create header title and subtitle
var headerText = createElement("div", "cognigy-header-text");
var headerTitle = createElement("span", "cognigy-header-title");
var headerSubtitle = createElement("span", "cognigy-header-subtitle");
headerTitle.appendChild(document.createTextNode("Chat"));
headerSubtitle.appendChild(document.createTextNode("Online"));
headerText.appendChild(headerTitle);
headerText.appendChild(headerSubtitle);

//Create bot avatar with Cognigy logo and append to header
var avatar = createElement("img", "cognigy-header-avatar");
avatar.src = "./images/cognigy_avatar.svg";
avatar.id = "cognigyHeaderLogo";
header.appendChild(avatar);

// Close button for header on mobile
var headerMobileClose = createElement("div", "displayNone", "cognigy-toggle-state-mobile");
headerMobileClose.onclick = handleChatOpen;

header.appendChild(headerText);
header.appendChild(headerMobileClose);
headerContainer.appendChild(header);
outerContainer.appendChild(headerContainer);

//Create chatContainer
var chatContainer = createElement("div", "cognigy-chat-container", "cognigy-container");
outerContainer.appendChild(chatContainer);

//Create chatForm with input, send button, record button and record toggle button
var chatForm = createElement("form", "cognigy-chat-form", "cognigy-form");
outerContainer.appendChild(chatForm);

var chatInput = createElement("textarea", "cognigy-chat-input", "cognigy-input");
chatInput.placeholder = "Write a reply";
// Send message on enter and not on shift + enter
//IE 11 polyfill for events
(function () {

  if (typeof window.CustomEvent === "function") return false;

  function CustomEvent(event, params) {
	params = params || { bubbles: false, cancelable: false, detail: undefined };
	var evt = document.createEvent('CustomEvent');
	evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
	return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

var messageEvent = new CustomEvent('submit', { cancelable: true });
chatInput.onkeydown = function (e) {
  e.keyCode === 13 && !e.shiftKey ? function () {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    document.getElementById('cognigy-form').dispatchEvent(messageEvent);
  }() : null;
};
chatForm.appendChild(chatInput);

var chatButton = createElement("button", "cognigy-chat-button", "cognigy-button");
var sendAvatar = createElement("img", "cognigy-send-icon");
sendAvatar.src = "./images/send.svg";
chatButton.appendChild(sendAvatar);
chatForm.appendChild(chatButton);

var recordToggleButton = createElement("button", "cognigy-record-toggle-button", "cognigy-record-toggle");
recordToggleButton.onclick = function () {
  handleRecordToggle();
};

recordToggleButton.type = "button";
var recordToggleAvatar = createElement("img", "cognigy-record-toggle-icon");
recordToggleAvatar.src = "./images/mic_on.svg";
recordToggleButton.appendChild(recordToggleAvatar);
chatForm.appendChild(recordToggleButton);

var recordButton = createElement("button", "displayNone", "cognigy-record");
recordButton.type = "button";
chatForm.insertBefore(recordButton, recordToggleButton);

/* This input will be hidden, so users see the button instead */
var fileUploadInput = createElement("input", "cognigy-file-upload-input", "cognigy-file-upload-input");
fileUploadInput.type = "file";
fileUploadInput.multiple = "true";
fileUploadInput.onchange = function() {
	document.getElementById('cognigy-file-upload-form').dispatchEvent(messageEvent);
}

var fileUploadForm = createElement("form", "cognigy-file-upload-form", "cognigy-file-upload-form");
fileUploadForm.enctype = "multipart/form-data"
fileUploadForm.append(fileUploadInput);

chatForm.appendChild(fileUploadForm);

var fileUploadButton = createElement("button", "cognigy-file-upload-button", "cognigy-file-upload-button");

fileUploadButton.type = "button";
var fileUploadAvatar = createElement("img", "cognigy-file-upload-icon");
fileUploadAvatar.src = "./images/file_upload.svg";
fileUploadButton.appendChild(fileUploadAvatar);
chatForm.appendChild(fileUploadButton);

var recordToggled = false;
function handleRecordToggle() {
  recordToggled = !recordToggled;

  if (recordToggled) {
	recordToggleAvatar.src = './images/mic_off.svg';
	//Change input to mic button
	chatInput.className = "displayNone";
	chatForm.style.justifyContent = "center";
	recordButton.className = "cognigy-record-button";
  } else {
	//Change from mic button to text input
	recordToggleAvatar.src = "./images/mic_on.svg";
	recordButton.className = "displayNone";
	chatInput.className = "cognigy-chat-input";
  }
}

function handleChatOpen() {
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

function handleSendMessage(e) {
  event.preventDefault ? event.preventDefault() : (event.returnValue = false);
  //Get the value from input, then create two divs to store/display the message
  var inputValue = document.getElementById("cognigy-input").value;
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
  avatar.src = "./images/user_avatar.jpg";
  messageContainer.appendChild(avatar);

  chatContainer.appendChild(messageContainer);
  //Keep scrollbar fixed at bottom when new messages are added
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

//Add event listener for form submit event
var formElement = document.getElementById("cognigy-form");
formElement.addEventListener("submit", function (e) {
  event.preventDefault ? event.preventDefault() : (event.returnValue = false);
	handleSendMessage(e);
}, false);

function handleDisplayRecording(transcript) {
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
  avatar.src = "./images/user_avatar.jpg";
  messageContainer.appendChild(avatar);

  chatContainer.appendChild(messageContainer);
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
  if (!answerFromCognigy || answerFromCognigy.text === "") return null;
  var cognigyAnswer = answerFromCognigy && answerFromCognigy.text;
  var chatContainer = document.getElementById("cognigy-container");

  //Display Facebook message if it is there. Otherwise display normal message
  if (answerFromCognigy && answerFromCognigy.data && (answerFromCognigy.data.facebook || answerFromCognigy.data._cognigy && answerFromCognigy.data._cognigy._facebook)) {
	var renderRichMessage = new RichMessages(answerFromCognigy.data, chatContainer);
	renderRichMessage.renderMessage();
  } else if (typeof cognigyAnswer !== 'undefined') {
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
}