//Function to create html elements
const createElement = function(type, className, id) {
    const element = document.createElement(type);
    element.className = className;
    if(id) {
      element.id = id;
    }

    return element;
}

const mainChatElement = document.getElementById("cognigy");
const outerContainer = createElement("div", "cognigy-outer-container__closed", "cognigy-outer-container");
const toggleChatState = createElement("div", "cognigy-chat-state-closed", "cognigy-toggle-state");
toggleChatState.onclick = handleChatOpen
mainChatElement.append(outerContainer);
mainChatElement.append(toggleChatState);

//Create standard header with text
const headerContainer = createElement("div", "cognigy-chat-header-container__open", "cognigy-header");
const header = createElement("div", "cognigy-chat-header");

//Create header title and subtitle
const headerText = createElement("div", "cognigy-header-text");
const headerTitle = createElement("span", "cognigy-header-title");
const headerSubtitle = createElement("span", "cognigy-header-subtitle");
headerTitle.append(document.createTextNode("Cognigy"));
headerSubtitle.append(document.createTextNode("Online"));
headerText.append(headerTitle)
headerText.append(headerSubtitle)
//Create bot avatar with Cognigy logo and append to header
const avatar = createElement("img", "cognigy-header-avatar");
avatar.src = "./images/cognigy_avatar.svg";
header.append(avatar);

header.append(headerText);
headerContainer.append(header);
outerContainer.append(headerContainer);

//Create chatContainer
const chatContainer = createElement("div", "cognigy-chat-container", "cognigy-container");
outerContainer.append(chatContainer);

//Create chatForm with input, send button, record button and record toggle button
const chatForm = createElement("form", "cognigy-chat-form", "cognigy-form");
outerContainer.append(chatForm);

const chatInput = createElement("input", "cognigy-chat-input", "cognigy-input");
chatInput.placeholder = "Write a reply";
chatForm.append(chatInput);

const chatButton = createElement("button", "cognigy-chat-button", "cognigy-button");
chatButton.type = "submit";
const sendAvatar = createElement("img", "cognigy-send-icon");
sendAvatar.src = "./images/send.svg";
chatButton.append(sendAvatar);
chatForm.append(chatButton);

const recordToggleButton = createElement("button", "cognigy-record-toggle-button", "cognigy-record-toggle");
recordToggleButton.onclick = () => handleRecordToggle();
recordToggleButton.type = "button";
const recordToggleAvatar = createElement("img", "cognigy-record-toggle-icon");
recordToggleAvatar.src = "./images/mic_off.svg";
recordToggleButton.append(recordToggleAvatar);
chatForm.append(recordToggleButton);

const recordButton = createElement("button", "displayNone", "cognigy-record");
recordButton.type = "button";		
chatForm.prepend(recordButton);

let recordToggled = false;
function handleRecordToggle() {	
	recordToggled = !recordToggled;

	if(recordToggled) {
		recordToggleAvatar.src = './images/mic_on.svg';
		//Change input to mic button
		chatInput.className = "displayNone";
		chatForm.style.justifyContent = "center";
		recordButton.className = "cognigy-record-button"

	} else { //Change from mic button to text input
		recordToggleAvatar.src = "./images/mic_off.svg";
		recordButton.className = "displayNone";	
		chatInput.className = "cognigy-chat-input";		
	}
}

function handleChatOpen() {
  const toggleChatState = document.getElementById("cognigy-toggle-state");
  const chatContainer = document.getElementById("cognigy-outer-container");
  const chatHeader = document.getElementById("cognigy-header");
  if(toggleChatState.className === "cognigy-chat-state-closed") {
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
  const inputValue = document.getElementById("cognigy-input").value;
  const chatContainer = document.getElementById("cognigy-container");  
  const messageContainer = document.createElement("div");
  const message = document.createElement("div");
  const messageValue = document.createTextNode(inputValue);
  message.className = "cognigy-chat-user-message";
  messageContainer.className= "cognigy-chat-user-message-container";
  message.append(messageValue);
  messageContainer.append(message);

  //Create user avatar and append to message contanier
  const avatar = document.createElement("img");
  avatar.className = "cognigy-chat-user-avatar";
  avatar.src = "./images/user_avatar.svg";
  messageContainer.append(avatar);

  chatContainer.append(messageContainer);
  //Keep scrollbar fixed at bottom when new messages are added
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

//Add event listener for form submit event
const formElement = document.getElementById("cognigy-form");
formElement.addEventListener("submit", (e) => handleSendMessage(e), false);

function handleDisplayRecording(transcript) {
	const chatContainer = document.getElementById("cognigy-container");  
	const messageContainer = document.createElement("div");
	const message = document.createElement("div");
	const messageValue = document.createTextNode(transcript);
	message.className = "cognigy-chat-user-message";
	messageContainer.className= "cognigy-chat-user-message-container";
	message.append(messageValue);
	messageContainer.append(message);
  
	//Create user avatar and append to message contanier
	const avatar = document.createElement("img");
	avatar.className = "cognigy-chat-user-avatar";
	avatar.src = "./images/user_avatar.svg";
	messageContainer.append(avatar);
  
	chatContainer.append(messageContainer);
	//Keep scrollbar fixed at bottom when new messages are added
	chatContainer.scrollTop = chatContainer.scrollHeight;
}

function displayCognigyMessage(answerFromCognigy) {
  if (!answerFromCognigy)
    return null;
  const cognigyAnswer = answerFromCognigy && answerFromCognigy.text;
  const chatContainer = document.getElementById("cognigy-container");

  if (typeof cognigyAnswer !== 'undefined') {
    const messageContainer = document.createElement("div");
    const message = document.createElement("div");
    const messageValue = document.createTextNode(cognigyAnswer);

    //Create bot avatar with Cognigy logo and append to message contanier
    const avatar = createElement("img", "cognigy-chat-bot-avatar");
    avatar.src = "./images/cognigy_logo.svg";
    messageContainer.append(avatar);

    // Append message to UI
    message.className = "cognigy-chat-bot-message";
    messageContainer.className= "cognigy-chat-bot-message-container";
    message.append(messageValue);
    messageContainer.append(message);

    chatContainer.append(messageContainer);

  }

  //Display Facebook message
  if (answerFromCognigy && answerFromCognigy.data && (answerFromCognigy.data.facebook || answerFromCognigy.data._cognigy && answerFromCognigy.data._cognigy._facebook)) {
    const renderRichMessage = new RichMessages(answerFromCognigy.data, chatContainer);
    renderRichMessage.renderMessage()
  }
  //Keep scrollbar fixed at bottom when new messages are added
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
