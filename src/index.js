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
const closeIcon = createElement("img", "cognigy-close-icon");
closeIcon.src = "close.svg";
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
avatar.src = "cognigy_avatar.svg";
header.append(avatar);

header.append(headerText);
headerContainer.append(header);
outerContainer.append(headerContainer);

//Create chatContainer
const chatContainer = createElement("div", "cognigy-chat-container", "cognigy-container");
outerContainer.append(chatContainer);

//Create chatForm with input and button
const chatForm = createElement("form", "cognigy-chat-form", "cognigy-form");
outerContainer.append(chatForm);

const chatInput = createElement("input", "cognigy-chat-input", "cognigy-input");
chatInput.placeholder = "Write a reply";
chatForm.append(chatInput);

const chatButton = createElement("button", "cognigy-chat-button", "cognigy-button");
chatButton.type = "submit";
const sendAvatar = createElement("img", "cognigy-send-icon");
sendAvatar.src = "send.svg";
chatButton.append(sendAvatar);
chatForm.append(chatButton);

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
  avatar.src = "user_avatar.svg";
  messageContainer.append(avatar);

  chatContainer.append(messageContainer);
  //Keep scrollbar fixed at bottom when new messages are added
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

//Add event listener for form submit event
const formElement = document.getElementById("cognigy-form");
formElement.addEventListener("submit", (e) => handleSendMessage(e), false);

function displayCognigyMessage(answerFromCognigy) {
  const cognigyAnswer = answerFromCognigy.text;
  const chatContainer = document.getElementById("cognigy-container");
  const messageContainer = document.createElement("div");
  const message = document.createElement("div");
  const messageValue = document.createTextNode(cognigyAnswer);

  //Create bot avatar with Cognigy logo and append to message contanier
  const avatar = createElement("img", "cognigy-chat-bot-avatar");
  avatar.src = "cognigy_logo.svg";
  messageContainer.append(avatar);

  // Append message to UI
  message.className = "cognigy-chat-bot-message";
  messageContainer.className= "cognigy-chat-bot-message-container";
  message.append(messageValue);
  messageContainer.append(message);

  chatContainer.append(messageContainer);

  //Display Facebook message
  if (answerFromCognigy.data && answerFromCognigy.data.facebook) {
    const renderRichMessage = new FacebookRichMessages(answerFromCognigy.data, chatContainer);
    renderRichMessage.renderMessage()
  }
  //Keep scrollbar fixed at bottom when new messages are added
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
