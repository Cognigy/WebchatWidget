//This class renders several of Facebook's templates for rich media.
class RichMessages {
    constructor(messageData, messageContainer) {
        if (messageData.facebook && messageData.facebook.attachment && messageData.facebook.attachment.payload) {
            this.messageData = messageData.facebook.attachment.payload;
        }
        else if (messageData._cognigy && messageData._cognigy._facebook && messageData._cognigy._facebook.message &&
            messageData._cognigy._facebook.message.attachment && messageData._cognigy._facebook.message.attachment.payload) {
            this.messageData = messageData._cognigy._facebook.message.attachment.payload;
            this.messageType = messageData._cognigy._facebook.message.attachment.type
        }
        
        this.messageContainer = messageContainer;
        this.quickReplies = messageData.facebook && messageData.facebook.quick_replies || (messageData._cognigy && messageData._cognigy._facebook
            && messageData._cognigy._facebook.message && messageData._cognigy._facebook.message.quick_replies);

        this.quickReplyText =  (messageData._cognigy && messageData._cognigy._facebook
            && messageData._cognigy._facebook.message);
    }

    findTemplate() {
        if (this.messageData) {
            return this.messageData.template_type;
        }
    }

    findElements() {
        if (this.messageData) {
            return this.messageData.elements;
        }
    }

    findButtons() {
        if (this.messageData) {
            return this.messageData.buttons;
        }
    }

    //Quick reply buttons
    renderQuickReplies() {
        const quickReplyContainer = document.createElement("div");
        quickReplyContainer.className = "quick_reply_container"
        displayCognigyMessage(this.quickReplyText);        

        // If there is only text, then return null
        if (!this.quickReplies) {
            return null;
        }

        //Add flex wrap wen there are more than three elements
        if (this.quickReplies.length > 3) {
            quickReplyContainer.className += " flex_wrap";
        }

        this.quickReplies.forEach(reply => {
            //Don't render button if there isn't a title
            if (!reply.title) {
                return null;
            }

            //Render quick reply button
            const quickReplyButton = document.createElement("button");
            quickReplyButton.onclick = () => handleCognigyMessage(reply.payload);
            quickReplyButton.className = "quick_reply";
            quickReplyButton.append(reply.title);
            

            //Render eventual image
            if (reply.image_url) {
                const img = document.createElement("img");
                img.src = reply.image_url;
                img.style.width = "24px";
                img.style.height = "24px";
                img.style.marginRight = "5px";
                quickReplyButton.prepend(img);
            }
            quickReplyContainer.append(quickReplyButton);
        })
        this.messageContainer.append(quickReplyContainer);
    }

    renderButton(button) {
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "button";
        buttonContainer.append(button.title);
        //Postback button sends a message to the server when clicked
        if (button.type === "postback") {
            buttonContainer.onclick = () => this.handleButtonPostback(button.payload)
        }
        //URL button redirects to a website
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
        //Postback button sends a message to the server when clicked
        if (button.type === "postback") {
            buttonContainer.onclick = () => this.handleButtonPostback(button.payload)
        }
        //URL button redirects to a website
        if (button.type == "web_url") {
            buttonContainer.onclick = () => this.handleButtonWebUrl(button.url)
        }
        return buttonContainer;
    }

    renderListElement(element, index) {
        let elementContainer = document.createElement("div");
        let elementContent = document.createElement("div");
        //Special styling for first list item
        if (this.messageData.top_element_style === "large" && index === 0) {
            elementContainer.className = "list_template_element_container_first"
            elementContent.className = "list_template_element_content_first";
            elementContainer.style.background = `url(${element.image_url}) center center / cover no-repeat, linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)) no-repeat`;
            elementContent.append(element.title);
            elementContainer.append(elementContent)
        }
        else {
            elementContainer.className = "list_template_element_container"
            elementContent.className = "list_template_element_content";
            elementContent.append(element.title);
            elementContainer.append(elementContent);
            let img = document.createElement("img");
            img.src = element.image_url;
            img.style.minWidth = "50px";
            img.style.height = "50px";
            elementContainer.append(img);

            //Append default action if specified
            if (element.default_action) {
                img.onclick = () => window.open(element.default_action.url);
            }
        }
        return { elementContainer, elementContent };
    }

    listTemplate() {
        const listContainer = document.createElement("div")
        listContainer.className = "list_template_container";

        this.findElements().forEach((element, index) => {
            let { elementContainer, elementContent } = this.renderListElement(element, index)
            if (element.buttons) {
                element.buttons.forEach(button => {
                    let buttonContainer = this.renderListButton(button);
                    //Special styling for first button
                    if (this.messageData.top_element_style === "large" && index === 0) {
                        buttonContainer.className = "list_template_element_button_first";
                    }
                    elementContent.append(buttonContainer);
                })
            }
            //Hide bottom border on last element
            if (this.findElements().length === (index + 1)) {
                elementContainer.style.borderBottom = "none";
            }
            listContainer.append(elementContainer)
        });

        if (this.findButtons()) {
            this.findButtons().forEach((button, index) => {
                let buttonContainer = this.renderButton(button);
                listContainer.append(buttonContainer);
            })
        }
       this.messageContainer.append(listContainer)
    }

    renderInformation(title) {
        const information = document.createElement("span");
        const informationContainer = document.createElement("div");
        informationContainer.className = "receipt_template_information_container";
        information.className = "receipt_template_information";
        information.append(title)
        informationContainer.append(information);

        return informationContainer;
    }

    carouselButtons(elementContainers, index) {
        //Increment and decrement buttons
        const carouselButtonsContainer = document.createElement("div");
        carouselButtonsContainer.className = "generic_template_carousel_buttons_container";
        const increment = document.createElement("div");
        increment.className = "generic_template_increment";
        increment.id = `genericTemplateIncrement${index}`;
        const decrement = document.createElement("div");
        decrement.className = "visibility_hidden";
        decrement.id = `genericTemplateDecrement${index}`;
        carouselButtonsContainer.append(decrement);
        carouselButtonsContainer.append(increment);
        //Start off by displaying the first elementContainer
        let i = 0;
        if (this.findElements()) {
            elementContainers[i].className = "generic_template_element_container";

            //Increment index from elementContainer when clicking button, thereby viewing next item
            increment.addEventListener('click', () => {
                elementContainers[index].className = "display_none";
                elementContainers[index + 1].className = "generic_template_element_container";

                //Show decrement button after first increment
                document.getElementById(`genericTemplateDecrement${index + 1}`).className = "generic_template_decrement";
                //Hide next increment button when viewing last item
                if (index === (elementContainers.length - 2)) {
                    document.getElementById(`genericTemplateIncrement${index + 1}`).className = "visibility_hidden";
                }
            });

            //Decrement index when clicking button, thereby viewing prevous item. Hidden to begin with
            decrement.addEventListener('click', () => {
                elementContainers[index].className = "display_none";
                elementContainers[index - 1].className = "generic_template_element_container"

                //Show next increment button after first decrement
                document.getElementById(`genericTemplateIncrement${index - 1}`).className = "generic_template_increment";

                //Hide Decrement button when viewing first item
                if (index === 0) {
                    document.getElementById(`genericTemplateDecrement${index - 1}`).className = "visibility_hidden";
                }
            });
        }

        return carouselButtonsContainer;
    }

    genericTemplate() {
        //Render container for image, title and buttons
        const genericContainer = document.createElement("div");
        genericContainer.className = "generic_template_container";

        const elementContainers = [];
    
        this.findElements().forEach((element, index) => {
            const elementContainer = document.createElement("div");
            elementContainers.push(elementContainer);
            //Append carousel mode if there are several elements
            if (this.findElements().length > 1) {
                elementContainer.className = "display_none";
                const carouselButtonsContainer = this.carouselButtons(elementContainers, index);
                elementContainer.append(carouselButtonsContainer);
            }
            //Get image - needs to be before the buttons
            const img = document.createElement("img");
            img.src = element.image_url;
            img.style.width = "100%";
            img.style.height = "200px";
            img.style.borderRadius = '10px 10px 0 0';
            elementContainer.prepend(img);
            //Append default action if specified
            if (element.default_action) {
                img.onclick = () => window.open(element.default_action.url);
            }
            //Render container for title + subtitle
            const textContainer = document.createElement("div");
            textContainer.className = "generic_template_text_container";
            elementContainer.append(textContainer);
            //Get Title
            if (element.title) {
                const genericTitle = document.createElement("p");
                genericTitle.className = "text_title";
                genericTitle.append(element.title);
                textContainer.append(genericTitle);
            }
            if (element.subtitle) {
                const genericSubtitle = document.createElement("p");
                genericSubtitle.className = "text_subtitle";
                genericSubtitle.append(element.subtitle)
                textContainer.append(genericSubtitle);
            }
            //Get eventual buttons
            if (element.buttons) {
                element.buttons.forEach(button => {
                    let buttonContainer = this.renderButton(button)
                    elementContainer.append(buttonContainer)
                })
            }
            genericContainer.append(elementContainer);
        })
        
         if (this.findButtons()) {
            this.findButtons().forEach(button => {
                let buttonContainer = this.renderButton(button)
                listContainer.append(buttonContainer);
            })
        }

        this.messageContainer.append(genericContainer)
    }


    //Receipt template
    receiptTemplate() {
        //Outer Container
        const receiptOuterContainer = document.createElement("div");
        receiptOuterContainer.className = "receipt_template_outer_container";

        //Header
        const headerContainer = document.createElement("div")
        headerContainer.className = "receipt_template_header_container";
        headerContainer.append("Order confirmation");
        receiptOuterContainer.append(headerContainer);

        //Items
        if (this.findElements()) {
            this.findElements().forEach(element => {
                //Container
                const elementContainer = document.createElement("div");
                elementContainer.className = "receipt_template_element_container";
                //Image
                if (element.image_url) {
                    const img = document.createElement("img");
                    img.style.width = "50px"
                    img.style.height = "50px";
                    img.style.border = "1px solid rgba(0,0,0,0.1)";
                    elementContainer.append(img);
                }
                //Text container
                const textContainer = document.createElement("div");
                textContainer.className = "receipt_template_text_container";
                //Get Title
                const elementTitle = document.createElement("span");
                elementTitle.className = "text_title";
                elementTitle.append(element.title);
                textContainer.append(elementTitle);
                //Get subtitle
                const elementSubtitle = document.createElement("span");
                elementSubtitle.className = "text_subtitle";
                elementSubtitle.append(element.subtitle)
                textContainer.append(elementSubtitle);
                elementContainer.append(textContainer);

                receiptOuterContainer.append(elementContainer);

            })
        }

        //Payments
        const paidWithContainer = this.renderInformation("Paid with");
        if (this.messageData.payment_method) {
            paidWithContainer.append(this.messageData.payment_method);
        }
        receiptOuterContainer.append(paidWithContainer);

        //Shipping address
        const shipToContainer = this.renderInformation("Ship to");
        if (this.messageData.address) {
            const address = this.messageData.address
            shipToContainer.append(`${address.street_1} 
                                    ${address.city} ${address.state} ${address.postal_code}`);
        }
        receiptOuterContainer.append(shipToContainer);

        //Recipient
        const recipientContainer = this.renderInformation("Recipient");
        if (this.messageData.recipient_name) {
            recipientContainer.append(this.messageData.recipient_name);
        }
        receiptOuterContainer.append(recipientContainer);

        //Order number
        const orderNumberContainer = this.renderInformation("Order number");
        if (this.messageData.order_number) {
            orderNumberContainer.append(this.messageData.order_number);
        }
        receiptOuterContainer.append(orderNumberContainer);

        //Order url
        const orderURLContainer = this.renderInformation("Order URL");
        if (this.messageData.order_url) {
            const orderURL = document.createElement("span");
            orderURL.className = "word_break";
            orderURL.append(this.messageData.order_url)
            orderURLContainer.append(orderURL)
        }
        receiptOuterContainer.append(orderURLContainer);

        //Subtotal
        const subtotalContainer = this.renderInformation("Subtotal");
        if (this.messageData.summary && this.messageData.summary.subtotal) {
            subtotalContainer.append(`$${this.messageData.summary.subtotal}`)
        }
        receiptOuterContainer.append(subtotalContainer);


        //Shipping cost
        const shippingCostContainer = this.renderInformation("Shipping cost");
        if (this.messageData.summary && this.messageData.summary.shipping_cost) {
            shippingCostContainer .append(`$${this.messageData.summary.shipping_cost}`)
        }
        receiptOuterContainer.append(shippingCostContainer);

        //Total tax
        const taxContainer = this.renderInformation("Total tax");
        if (this.messageData.summary && this.messageData.summary.total_tax) {
            taxContainer.append(`$${this.messageData.summary.total_tax}`)
        }
        receiptOuterContainer.append(taxContainer );

        //Adjustments
        const adjustmentsTitle = document.createElement("span");
        const adjustmentsContainer = document.createElement("div");
        adjustmentsContainer.className = "receipt_template_information_container";
        adjustmentsTitle.className = "text_title";
        adjustmentsTitle.append("Adjustments")
        adjustmentsContainer.append(adjustmentsTitle);

        receiptOuterContainer.append(adjustmentsContainer);

        //Loop through adjustments
        if (this.messageData.adjustments) {
            this.messageData.adjustments.forEach(adjustment => {
                const adjustmentContainer = this.renderInformation(adjustment.name);
                adjustmentContainer.style.marginTop = '0px';
                adjustmentContainer.append('Amount:' + adjustment.amount);
                receiptOuterContainer.append(adjustmentContainer)
            })
        }

        //Summary
        const summaryContainer = document.createElement("div")
        summaryContainer.className = "receipt_template_summary_container";

        const total = document.createElement("span");
        total.className = "receipt_template_summary_total"
        total.append("Total");

        const price = document.createElement("span");
        price.className = "receipt_template_summary_price";
        if (this.messageData.summary && this.messageData.summary.total_cost) {
            price.append(`$${this.messageData.summary.total_cost}`);
        }

        summaryContainer.append(total);
        summaryContainer.append(price);
        receiptOuterContainer.append(summaryContainer);

        this.messageContainer.append(receiptOuterContainer);
    }

    buttonTemplate() {
        const buttonsOuterContainer = document.createElement("div");
        buttonsOuterContainer.className = "button_template_outer_container"

        // Check for text message
        if (this.messageData.text) {
            var buttonText = document.createElement("div");
            buttonText.className = "button_template_text";
            buttonText.appendChild(document.createTextNode(this.messageData.text));
            buttonsOuterContainer.appendChild(buttonText);
        }

        // Loop over buttons
        this.messageData.buttons.forEach((button, index) => {
            const buttonContainer = this.renderButton(button);
            if (index !== 0) {
                buttonContainer.style.borderTop = "1px solid rgba(0,0,0,0.1)";
            }
            buttonContainer.className = "button_template_container"
            buttonsOuterContainer.append(buttonContainer);
        })
        this.messageContainer.append(buttonsOuterContainer);

        //Create bot avatar with Cognigy logo and append to message contanier
        const avatar = createElement("img", "cognigy-chat-bot-avatar");
        avatar.src = "./images/cognigy_logo.svg";
        this.messageContainer.append(avatar);
    }

    renderMessage() {
        //Render button template
        if (this.findTemplate() === "button") {
            this.buttonTemplate();
        }
        //Render list template
        if (this.findTemplate() === "list") {
            this.listTemplate();
        }
        //Render generic template
        if (this.findTemplate() === "generic") {
            this.genericTemplate();
        }

        //Render receipt template
        if (this.findTemplate() === "receipt") {
            this.receiptTemplate();
        }

        //Render quick replies
        this.renderQuickReplies();

        // Render image
        if (this.messageType === "image") {
            const image = document.createElement("img");
            image.src = this.messageData.url;
            image.className = "image_template"
            this.messageContainer.append(image)

            //Create bot avatar with Cognigy logo and append to message contanier
            const avatar = createElement("img", "cognigy-chat-bot-avatar");
            avatar.src = "./images/cognigy_logo.svg";
            this.messageContainer.append(avatar);
        }
    }
}