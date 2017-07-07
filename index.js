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
  let chatElementClass = chatElement.className;
  if(chatElementClass === "cognigy-web-chat") {
    chatElement.className = "cognigy-web-chat__open";
    const createForm = document.createElement("form");
    chatElement.append(createForm);
  } else {
    chatElement.className = "cognigy-web-chat";
  }
}
