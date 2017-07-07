//Function runs onload
function createInitialElements() {
  const chatElement = document.getElementById("cognigy");
  //Create standard header with text
  const header = document.createElement("div");
  const headerText = document.createTextNode("Chat with us");
  header.appendChild(headerText);
  chatElement.append(header);
}

function handleChatOpen() {
  const chatElement = document.getElementById("cognigy");
  const chatContainer = document.getElementById("cognigy-container");
  const chatHeader = document.getElementById("cognigy-header");
  let chatElementClass = chatElement.className;
  if(chatElementClass === "cognigy-web-chat") {
    chatElement.className = "cognigy-web-chat__open";
    //const createForm = document.createElement("form");
    //chatElement.append(createForm);
    chatHeader.className = "cognigy-chat-header-container__open"
    chatContainer.className = "cognigy-chat-container";
  } else {
    chatElement.className = "cognigy-web-chat";
    chatContainer.className = "displayNone";
    chatHeader.className = "cognigy-chat-header-container"
  }
}

function handleSendMessage() {
  //Get the value from input, then create to divs to store/display the message
  const inputValue = document.getElementById("cognigy-input").value;
  const chatWindow = document.getElementById("cognigy-chat-window");
  const messageContainer = document.createElement("div");
  const message = document.createElement("div");
  const messageValue = document.createTextNode(inputValue);
  message.className = "cognigy-chat-user-message";
  messageContainer.className= "cognigy-chat-user-message-container";
  message.append(messageValue);
  messageContainer.append(message);
  chatWindow.append(messageContainer);
}
