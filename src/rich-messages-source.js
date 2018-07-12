/* Node modules */
import { h, render } from 'preact';

/* Custom modules */
import Carousel from "./carousel/Carousel.jsx";

//This class renders several of Facebook's templates for rich media.
var RichMessages = (function () {
    function RichMessages(messageData, messageContainer, readCognigyMessage, handleDisplayPostbackMessage, handleCognigyMessage, messageLogoUrl, displayCognigyMessage) {
        this.readCognigyMessage = readCognigyMessage;
        this.handleDisplayPostbackMessage = handleDisplayPostbackMessage;
        this.handleCognigyMessage = handleCognigyMessage;
        this.messageLogoUrl = messageLogoUrl;
        this.displayCognigyMessage = displayCognigyMessage;


        if (messageData.message && messageData.message.attachment && messageData.message.attachment.payload) {
            this.messageData = messageData.message.attachment.payload;
        }

        this.messageContainer = messageContainer;
        this.quickReplies = messageData.message && messageData.message.quick_replies;
        this.quickReplyText = messageData.message;
    }
    RichMessages.prototype.findTemplate = function () {
        if (this.messageData) {
            return this.messageData.template_type;
        }
    };
    RichMessages.prototype.findElements = function () {
        if (this.messageData) {
            return this.messageData.elements;
        }
    };
    RichMessages.prototype.findButtons = function () {
        if (this.messageData) {
            return this.messageData.buttons;
        }
    };
    //Quick reply buttons
    RichMessages.prototype.renderQuickReplies = function () {
        var quickReplyContainer = document.createElement("div");
        quickReplyContainer.className = "quick_reply_container";

        this.displayCognigyMessage(this.quickReplyText, this.messageLogoUrl, this.readCognigyMessage);

        if (!this.quickReplies)
            return null;
        //Add flex wrap wen there are more than three elements
        if (this.quickReplies.length > 3) {
            quickReplyContainer.className += " flex_wrap";
        }
        this.quickReplies.forEach((reply) => {
            //Don't render button if there isn't a title
            if (!reply.title) {
                return null;
            }

            //Render quick reply button
            var quickReplyButton = document.createElement("button");

            //Render eventual image
            if (reply.image_url) {
                var img = document.createElement("img");
                img.src = reply.image_url;
                img.style.width = "24px";
                img.style.height = "24px";
                img.style.marginRight = "5px";
                quickReplyButton.appendChild(img);
            }

            quickReplyButton.onclick = () => {
                this.handleDisplayPostbackMessage(reply.title);
                return this.handleCognigyMessage(reply.payload);
            };
            quickReplyButton.className = "quick_reply";
            var buttonTitle = document.createTextNode(reply.title)
            quickReplyButton.appendChild(buttonTitle);

            quickReplyContainer.appendChild(quickReplyButton);
        });
        this.messageContainer.appendChild(quickReplyContainer);
    };
    RichMessages.prototype.renderButton = function (button) {
        var _this = this;
        var buttonContainer = document.createElement("div");
        buttonContainer.className = "button";
        var buttonTitle = document.createTextNode(button.title)
        buttonContainer.appendChild(buttonTitle);
        //Postback button sends a message to the server when clicked
        if (button.type === "postback") {
            buttonContainer.onclick = function () { return _this.handleButtonPostback(button.title, button.payload); };
        }
        //URL button redirects to a website
        if (button.type == "web_url") {
            buttonContainer.onclick = function () { return _this.handleButtonWebUrl(button.url); };
        }

        //Wirecard button initializes wirecard payment 
        if (button.type == "wirecard") {
            buttonContainer.onclick = function () { return button.callback(); }
        }
        return buttonContainer;
    };
    RichMessages.prototype.handleButtonPostback = function (title, postbackMessage) {
        this.handleDisplayPostbackMessage(title);
        this.handleCognigyMessage(postbackMessage);
    };
    RichMessages.prototype.handleButtonWebUrl = function (url) {
        /* Check whether the url is an fbextension. If it is, we open the window as a popup */
        if (url.match("fbextension")) {
            /* The code below ensures that the popup opens centered, even on dual monitors */
            var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
            var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

            var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            var w = 900;
            var h = 500;

            var left = ((width / 2) - (w / 2)) + dualScreenLeft;
            var top = ((height / 2) - (h / 2)) + dualScreenTop;
            var newWindow = window.open(url, "cognigyWebchat", 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

            // Puts focus on the newWindow
            if (window.focus) {
                newWindow.focus();
            }

        } else {
            window.open(url);
        }
    };
    RichMessages.prototype.renderListButton = function (button) {
        var _this = this;
        var buttonContainer = document.createElement("button");
        buttonContainer.className = "list_template_element_button";
        var buttonTitle = document.createTextNode(button.title)
        buttonContainer.appendChild(buttonTitle);
        //Postback button sends a message to the server when clicked
        if (button.type === "postback") {
            buttonContainer.onclick = function () { return _this.handleButtonPostback(button.title, button.payload); };
        }
        //URL button redirects to a website
        if (button.type == "web_url") {
            buttonContainer.onclick = function () { return _this.handleButtonWebUrl(button.url); };
        }
        return buttonContainer;
    };
    RichMessages.prototype.renderListElement = function (element, index) {
        var elementContainer = document.createElement("div");
        var elementContent = document.createElement("div");
        var elementTitle = document.createTextNode(element.title)
        /* Don't render two consecutive newlines */
        var elementSubtitle = document.createElement("p");
        elementSubtitle.className = "text_subtitle";
        var elementSubtitleText = document.createTextNode(element.subtitle.replace(/\n\s*\n/g, '\n'));
        elementSubtitle.appendChild(elementSubtitleText);

        /* Read subtitle */
        if (element.subtitle) {
            this.readCognigyMessage(element.subtitle);
        }

        elementContent.appendChild(elementTitle);
        elementContent.appendChild(elementSubtitle);
        //Special styling for first list item
        if (this.messageData.top_element_style === "large" && index === 0) {
            elementContainer.className = "list_template_element_container_first";
            elementContent.className = "list_template_element_content_first";
            elementContainer.style.background = "url(" + element.image_url + ") center center / cover no-repeat, linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)) no-repeat";
            elementContainer.appendChild(elementContent);
        }
        else {
            elementContainer.className = "list_template_element_container";
            elementContent.className = "list_template_element_content";
            elementContainer.appendChild(elementContent);
            var img = document.createElement("img");
            img.src = element.image_url;
            img.style.minWidth = "50px";
            img.style.height = "50px";
            elementContainer.appendChild(img);
            //appendChild default action if specified
            if (element.default_action) {
                img.onclick = function () { return window.open(element.default_action.url); };
            }
        }
        return { elementContainer: elementContainer, elementContent: elementContent };
    };
    RichMessages.prototype.listTemplate = function () {
        var _this = this;
        var messageInnerContainer = createElement("div", "cognigy-chat-bot-message-container");
        this.createAvatar(messageInnerContainer);

        var listContainer = document.createElement("div");
        listContainer.className = "list_template_container";
        this.findElements().forEach(function (element, index) {
            var _a = _this.renderListElement(element, index), elementContainer = _a.elementContainer, elementContent = _a.elementContent;
            if (element.buttons) {
                element.buttons.forEach(function (button) {
                    var buttonContainer = _this.renderListButton(button);
                    //Special styling for first button
                    if (_this.messageData.top_element_style === "large" && index === 0) {
                        buttonContainer.className = "list_template_element_button_first";
                    }
                    elementContent.appendChild(buttonContainer);
                });
            }
            //Hide bottom border on last element
            if (_this.findElements().length === (index + 1)) {
                elementContainer.style.borderBottom = "none";
            }
            listContainer.appendChild(elementContainer);
        });
        if (this.findButtons()) {
            this.findButtons().forEach(function (button, index) {
                var buttonContainer = _this.renderButton(button);
                listContainer.appendChild(buttonContainer);
            });
        }

        messageInnerContainer.appendChild(listContainer);
        this.messageContainer.appendChild(messageInnerContainer);
    };
    RichMessages.prototype.renderInformation = function (title) {
        var information = document.createElement("span");
        var informationContainer = document.createElement("div");
        informationContainer.className = "receipt_template_information_container";
        information.className = "receipt_template_information";
        information.appendChild(title);
        informationContainer.appendChild(information);
        return informationContainer;
    };
    RichMessages.prototype.buttonTemplate = function () {
        var _this = this;
        var messageInnerContainer = createElement("div", "cognigy-chat-bot-message-container");
        this.createAvatar(messageInnerContainer);

        var buttonsOuterContainer = document.createElement("div");
        buttonsOuterContainer.className = "button_template_outer_container";
        if (this.messageData.text) {
            /* Read text */
            _this.readCognigyMessage(this.messageData.text);

            var buttonText = document.createElement("div");
            buttonText.className = "button_template_text";
            buttonText.appendChild(document.createTextNode(this.messageData.text));
            buttonsOuterContainer.appendChild(buttonText);
        }
        this.messageData.buttons.forEach(function (button, index) {
            var buttonContainer = _this.renderButton(button);
            if (index !== 0) {
                buttonContainer.style.borderTop = "1px solid rgba(0,0,0,0.1)";
            }
            buttonContainer.className = "button_template_container";
            buttonsOuterContainer.appendChild(buttonContainer);
        });

        messageInnerContainer.appendChild(buttonsOuterContainer);
        this.messageContainer.appendChild(messageInnerContainer);
    };

    RichMessages.prototype.wirecardTemplate = function () {
        var _this = this;
        var messageInnerContainer = createElement("div", "cognigy-chat-bot-message-container");
        this.createAvatar(messageInnerContainer);

        var wirecardContainer = createElement("div", "wirecard-container");
        var seamlessFormTarget = document.createElement("div");

        if (this.messageData.data) {
            var wirecardFormText = document.createElement("div");
            wirecardFormText.className = "wirecard-form-text";
            wirecardFormText.appendChild(document.createTextNode(`Grand Total: ${this.messageData.data.value}$`));
            wirecardContainer.appendChild(wirecardFormText);
        }

        const divId = "seamless-form-target" + Date.now();
        seamlessFormTarget.id = divId;
        seamlessFormTarget.className = "seamless-form-target";

        var buttonContainer = document.createElement("div");
        buttonContainer.className = "wirecard-button";
        var buttonTitle = document.createTextNode("pay")
        buttonContainer.appendChild(buttonTitle);

        buttonContainer.onclick = () => { this.messageData.callback("wirecard"); };

        wirecardContainer.appendChild(seamlessFormTarget);
        wirecardContainer.appendChild(buttonContainer);
        messageInnerContainer.appendChild(wirecardContainer);
        this.messageContainer.appendChild(messageInnerContainer);
        this.messageData.render(divId);
    }

    RichMessages.prototype.createAvatar = function (messageInnerContainer) {
        //Create bot avatar with Cognigy logo and appendChild to message contanier
        let avatar = createElement("img", "cognigy-chat-bot-avatar");

        /* If we can load the logo image, then we use it. Otherwise we use the Cognigy logo */
        var img = new Image();
        img.onload = () => {
            avatar.src = this.messageLogoUrl;
        };
        img.onerror = function () {
            avatar.src = "https://s3.eu-central-1.amazonaws.com/cognigydev/CognigyWebchat/images/cognigy_logo.svg";
        };
        img.src = this.messageLogoUrl;

        messageInnerContainer.appendChild(avatar);

        return avatar;
    }

    RichMessages.prototype.renderMessage = function () {
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
            render(
                <Carousel
                    messageLogoUrl={this.messageLogoUrl}
                    galleryElements={this.findElements()}
                    handleButtonPostback={this.handleButtonPostback.bind(this)}
                    handleButtonWebUrl={this.handleButtonWebUrl.bind(this)}
                />,
                this.messageContainer);
        }

        if (this.findTemplate() === "wirecard") {
            this.wirecardTemplate();
        }

        //Render quick replies
        if (this.quickReplies || this.quickReplyText) {
            this.renderQuickReplies();
        }
    };
    return RichMessages;
}());
var createElement = function (type, className, id) {
    var element = document.createElement(type);
    element.className = className;
    if (id) {
        element.id = id;
    }
    return element;
};

module.exports = {
    RichMessages
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmljaE1lc3NhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyaWNoTWVzc2FnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvRUFBb0U7QUFDcEU7SUFJSSxzQkFBWSxXQUFXLEVBQUUsZ0JBQWdCO1FBQ3JDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxVQUFVLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNyRyxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztRQUMvRCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxTQUFTLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsT0FBTztZQUN2RyxXQUFXLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFLLFdBQVcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNsSCxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO1FBQ2pGLENBQUM7UUFDRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7UUFDekMsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUMsUUFBUSxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLFNBQVM7ZUFDbEksV0FBVyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsT0FBTyxJQUFJLFdB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