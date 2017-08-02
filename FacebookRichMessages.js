
class FacebookRichMessages {
    constructor(messageData, messageContainer) {
        this.messageData = messageData.facebook.attachment.payload;
        this.messageContainer = messageContainer;
    }

    findTemplate() {
        return this.messageData.template_type;
    }

    findElements() {
        return this.messageData.elements;
    }

    findButtons() {
        return this.messageData.buttons;
    }

    renderButton(button) {
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "button";
        buttonContainer.append(button.title);
        if (button.type === "postback") {
            buttonContainer.onclick = () => this.handleButtonPostback(button.payload)
        }
        if (button.type == "web_url") {
            buttonContainer.onclick = () => this.handleButtonWebUrl(button.url)
        }
        return buttonContainer;
    }

    handleButtonPostback(postbackMessage) {
        handleCognigyMessage(postbackMessage)
    }

    handleButtonWebUrl(url) {
        window.open(url);
    }

    renderListButton(button) {
        const buttonContainer = document.createElement("button");
        buttonContainer.className = "list_template_element_button";
        buttonContainer.append(button.title);
        buttonContainer.onclick = () => this.handleButtonPostback(button.payload)

        return buttonContainer;
    }

    renderListElement(element) {
        let elementContainer = document.createElement("div");
        let elementContent = document.createElement("div");
        elementContent.className = "list_template_element_content";
        elementContainer.className = "list_template_element_container"
        elementContent.append(element.title);
        elementContainer.append(elementContent);
        let img = document.createElement("img");
        img.src = element.image_url;
        img.style.minWidth = "50px";
        img.style.height = "50px";
        elementContainer.append(img);

        return { elementContainer, elementContent };
    }

    listTemplate() {
        const listContainer = document.createElement("div")
        listContainer.className = "list_template_container";

        this.findElements().forEach(element => {
            let { elementContainer, elementContent } = this.renderListElement(element)
            if (element.buttons) {
                element.buttons.forEach(button => {
                    let buttonContainer = this.renderListButton(button)
                    elementContent.append(buttonContainer)
                })
            }
            listContainer.append(elementContainer)
        });

        if (this.findButtons()) {
            this.findButtons().forEach(button => {
                let buttonContainer = this.renderButton(button)
                listContainer.append(buttonContainer);
            })
        }
       this.messageContainer.append(listContainer)
    }

    genericTemplate() {
        //Render container for image, title and buttons
        const genericContainer = document.createElement("div");
        genericContainer.className = "generic_template_container";
        //Render container for title + subtitle
        const textContainer = document.createElement("div");
        textContainer.className = "generic_template_text_container";
        genericContainer.append(textContainer);

        this.findElements().forEach(element => {
            //Get image
            const img = document.createElement("img");
            img.src = element.image_url;
            img.style.width = "100%";
            img.style.height = "75%";
            genericContainer.append(img);
            //Get Title
            const genericTitle = document.createElement("p");
            genericTitle.className = "generic_template_text_title";
            genericTitle.append(element.title);
            textContainer.append(genericTitle);
            //Get subtitle
            const genericSubtitle = document.createElement("p");
            genericSubtitle.className = "generic_template_text_subtitle";
            genericSubtitle.append(element.subtitle)
            textContainer.append(genericSubtitle);
            //Get eventual buttons
            if (element.buttons) {
                element.buttons.forEach(button => {
                    let buttonContainer = this.renderButton(button)
                    genericContainer.prepend(buttonContainer)
                })
            }
        })

        if (this.findButtons()) {
            this.findButtons().forEach(button => {
                let buttonContainer = this.renderButton(button)
                listContainer.append(buttonContainer);
            })
        }

        this.messageContainer.append(genericContainer)
    }

    renderMessage() {
        //Render button template
        if (this.findTemplate() === "button") {
            const buttonContainer = document.createElement("div")
            this.messageContainer.append(buttonContainer)
        }
        //Render list template
        if (this.findTemplate() === "list") {
            this.listTemplate();
        }
        //Render generic template
        if (this.findTemplate() === "generic") {
            this.genericTemplate();
        }
    }
}