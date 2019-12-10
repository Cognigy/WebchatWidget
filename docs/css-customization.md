# CSS Customization

In order to enhance the visual design of the Webchat, there is the possibility to apply custom CSS.
You will have to add the style to your embeded Webchat or just link a CSS file to it.

See it in action:  
[![Edit CSS Customization](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/css-customization-gv35e?fontsize=14&hidenavigation=1&theme=dark)

There are several classes that you need to take in consideration if you want to make some changes to the Webchat, the classes '*bot*' and '*user*' are used as helper classes that give us the possibility to customize the messages from the user and the bot separatly. The classes are the following:

* *webchat-root*
* *webchat*
* *webchat-header-bar*
* *webchat-header-logo*
* *webchat-header-title*
* *webchat-header-close-button*
* *webchat-chat-history*
* *webchat-message-row*
* *regular-message*
* *webchat-avatar*
* *webchat-message-row + bot*
* *regular-message + bot*
* *webchat-avatar + bot*
* *webchat-message-row + user*
* *regular-message + user*
* *webchat-avatar + user*
* *webchat-chat-typing-indicator*
* *webchat-input*
* *webchat-input-menu-form*
* *webchat-input-button-menu*
* *webchat-input-message-input*
* *webchat-input-button-send*
* *webchat-input-persistent-menu*
* *webchat-input-persistent-menu-title*
* *webchat-input-persistent-menu-item*
* *webchat-toggle-button*

If you want to be sure that the custom CSS that you apply will be showed, you will have to add some other selectors to those classes, for the Webchat we will use the attribute selectors:
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat] [data-cognigy-webchat-toggle]
```
This way we asure specificity of the classes in our script.

An example where we change the color of the Webchat header:
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat].webchat .webchat-header-bar {

    background: rgb(15, 15, 194);
}
```
### Here are the used classes with an example on how to apply them.

The following code snippets are just suggestions so it shows the syntax required to acces all classes, the examples shown here are simple design changes so you get the idea how it works. You can change all this properties in any way you want, keep in mind that some components are nested in others and that some properties won't have an effect due to the nature of the Webchat widget

* *webchat-root*  
This is the root <div> containingthe webchat, not much to customize here.
```CSS
[data-cognigy-webchat-root].webchat-root {

}
```
* *webchat*  
This class is the main Webchat component that can be customized, you can add size like height or width in it.
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat].webchat {
    width: 500px;
    height:500px;
}
```
* *webchat-header-bar*  
The header bar of the Webchat, here you can change color, it also contains other components like the header logo and header title.
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat].webchat .webchat-header-bar {

    background: rgb(5, 5, 131);
}
```
* *webchat-header-logo*  
The logo of the Webchat, it can be changed by editing the URL.
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat].webchat .webchat-header-logo {

    background-image: url(https://...);
    margin-left: 10px;
}
```
* *webchat-header-title*  
The text that is in the header, you can modify the font as you wish.
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat].webchat .webchat-header-title {

    text-align: center;
    font-size: 20px;
}
```
* *webchat-chat-history*  
This is the element where all the messages of the chat are are showed, you could change its color for example.
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat].webchat .webchat-chat-history {

    background-color: rgb(48, 48, 48);
}
```
* *webchat-message-row*  
The general class for any message in the chat, containing the message and the avatar logo.
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat].webchat .webchat-message-row {

    padding-right: 10px;

}
```
* *regular-message*  
The text of the message, you can change the font and style the dialog bubble,  this one comes from the regular message plugin that comes shipped with the Webchat!
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat].webchat .regular-message {

    border:2px solid  white;
    background: black;
    color:white;
    box-shadow: none;

}
```
* *webchat-avatar*  
The icon from the avatar that will be show when a message is written or received. You can put the avatar you like by adding a URL to it.
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat].webchat .webchat-avatar {

    background-image: url(https://***.png);
    width: 30px;
    height: 28px;
}
```
* *webchat-message-row + bot*  
The classes for the bot message in the chat, containing the message and the avatar logo.
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat].webchat .webchat-message-row.bot {

    padding-right: 10px;

}
```
* *regular-message + bot*  
The text of the message from the bot, you can change the font and style the dialog bubble.
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat].webchat .regular-message.bot {

    background: rgb(5, 5, 131);    
    box-shadow: none;
}
```
* *webchat-avatar + bot*  
The icon from the bot that will be show when a message is received. You can put the avatar you like by adding a URL to it.
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat].webchat .webchat-avatar.bot {

    background-image: url(https://***.png);
    width: 30px;
    height: 28px;
    
}
```
* *webchat-message-row + user*  
The class for the user message in the chat, containing the message and the avatar logo.
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat].webchat .webchat-message-row.user {

    padding-right: 10px;

}
```
* *regular-message + user*  
The text of the message from the user, you can change the font and style the dialog bubble.
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat].webchat .regular-message.user {

    background: rgb(5, 5, 131);    
    box-shadow: none;
}
```
* *webchat-avatar + user*  
The icon from the user that will be show when a message is received. You can put the avatar you like by adding a URL to it.
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat].webchat .webchat-avatar.user {

    background-image: url(https://***.png);
    width: 30px;
    height: 28px;
    
}
```
* *webchat-chat-typing-indicator*  
The typing indicator bubble of the message from the bot, you can change the background color.
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat].webchat .webchat-typing-indicator {

    background: rgb(5, 5, 131);
}
```

* *webchat-input*  
The footer of the Webchat, it contains some other components like the text input, menu and buttons.
Careful to modify the height here since it will influence the input menu
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat].webchat .webchat-input {
   
   background: rgb(5, 5, 131);
}
```
* *webchat-input-menu-form*  
The form that will take care of submit the message, you can modify the borders for example.
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat].webchat .webchat-input-menu-form {

    border-bottom-color: rgb(5, 5, 131);
}
```
* *webchat-input-button-menu*  
The sandwich menu to open the input menu, you can not change the icon but you can customize the position, size and background.
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat].webchat .webchat-input-button-menu {

    border-radius: 5px;
    background-color: white;
}
```
* *webchat-input-message-input*  
The text input where you can write your messages, you can change how the font looks like.
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat].webchat .webchat-input-message-input {
   
   color: white;
}
```
* *webchat-input-button-send*  
The button to send the message, you can not change the icon but you can customize the position, size and background.
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat].webchat .webchat-input-button-send {

    border-radius: 20px;
    background-color: white;
    
}
```
* *webchat-input-persistent-menu*  
This is the persistent input menu, you can change its color. It also contains the menu title and menu items components.
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat].webchat .webchat-input-persistent-menu {

    background: white;

}
```
* *webchat-input-persistent-menu-title*  
The text title from the persistent input menu, you can modify the font.
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat].webchat .webchat-input-persistent-menu-title {
 
     color: white;
     
}
```
* *webchat-input-persistent-menu-item*  
The persistent input menu items, where you can modify it borders, and fonts for example.
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat].webchat .webchat-input-persistent-menu-item {
   
   border-color: white;
   color:white;
   
}
```
* *webchat-toggle-button* 
This is the button to open the Webchat, if you want to modify its color you have to set the "background-image" to none.
```CSS
[data-cognigy-webchat-root] [data-cognigy-webchat-toggle].webchat-toggle-button {

    background-image: none;
    background-color: rgb(5, 5, 131);
}

```
## Facebook Messenger messages customization

Our Webchat ships with "Facebook-Messenger-like" message templates out of the box (Quick replies, Buttons, Image Galleries, Media, Lists) these elements can be also customized to meet design guidelines even more!

Here are the classes that you can use to modify it:

See it in action:


### Quick Replies

* *messenger-quick-reply*  
This class contains the whole Quick Reply element, you can modify it's size for example.
```CSS
[data-cognigy-webchat-root] .messenger-quick-reply {
width: 500px;
height: 500px;
}

```
* *messenger-quick-reply-header-message*  
This is the header message of the Quick Reply.
```CSS
[data-cognigy-webchat-root] .messenger-quick-reply-header-message { 
  border:2px solid  #fffffe;
  border-radius: 0;
  text-align: center;
  background: #e3f6f5;
  color: #272343;
  animation: "Some animation" ;
}

```
* *messenger-quick-reply-replies*  
This is the element holding all Quick Replies, you can change the way they are shown. Like a column.
```CSS
[data-cognigy-webchat-root] .messenger-quick-reply-replies {
  display: flex;
  flex-direction: column;
}

```
* *messenger-quick-reply-reply-container*  
This is the single Quick Reply element, all of them will be modified.
```CSS
[data-cognigy-webchat-root] .messenger-quick-reply-replies .messenger-quick-reply-reply-container {
    animation: "Some animation" ;
    border-color:#272343;
    color: #2d334a;
}

```
* *messenger-quick-reply-reply-text*  
This is the text inside the Quick Reply, all of them will be modified
```CSS
[data-cognigy-webchat-root] .messenger-quick-reply-replies .messenger-quick-reply-reply-container
  .messenger-quick-reply-reply-text {
  color: yellow;
}

```

### Buttons

* *messenger-buttons*  
This class contents the Buttons element.
```CSS
[data-cognigy-webchat-root] .messenger-buttons {
  border-radius: 0;
  animation: "Some animation" ;
}

```
* *messenger-buttons-header*  
The container and header of the buttons, you could modify the text position and style.
```CSS
[data-cognigy-webchat-root] .messenger-buttons-header {
  text-align: center;
  font-weight: bold;
  background: #e3f6f5;
}

```
* *messenger-button-container*  
The container of a single button, you can add cool animations when hovering and styling  .
```CSS
[data-cognigy-webchat-root] .messenger-buttons .messenger-button-container {
    background-color: #fffffe;
    color: #2d334a;
}

[data-cognigy-webchat-root] .messenger-buttons .messenger-button-container:hover {
  animation: "Some animation" 1s ease;
  animation-iteration-count: 1;
  font-weight: bold;
}

```

### Image Gallery

* *messenger-carousel-container*  
The element that contains the card from a Gallery, here you can increase it's size for example.
```CSS
[data-cognigy-webchat-root] .messenger-carousel-container {
  width: 200px;
}

```
* *messenger-carousel-text-content*  
The content of the card, you can modify it's height and make it look smaller so you could show more content.
```CSS
[data-cognigy-webchat-root] .messenger-carousel-text-content {
  background: #e3f6f5;
  height: 200px;
}

```
* *messenger-carousel-title*  
The title of the card.
```CSS
[data-cognigy-webchat-root] .messenger-carousel-title {
    color:blue;
}

```
* *messenger-carousel-subtitle*  
The title of the card.
```CSS
[data-cognigy-webchat-root] .messenger-carousel-subtitle {
  color:white;
}
```
* *messenger-carousel-button*  
The Button at the bottom of the card, containing a URL.
```CSS
[data-cognigy-webchat-root] .messenger-carousel-button {
  color: #272343;
  background: #ffd803;
}

[data-cognigy-webchat-root] .messenger-carousel-button:hover {
  background: #cfb000;
}
```

### Media

* *messenger-media*  
The media element can be of three forms, Image, Video and Audio. You can modify it's container or put some animations on it
```CSS
[data-cognigy-webchat-root] .messenger-media-image {
  animation: rotate 1s;
}

[data-cognigy-webchat-root] .messenger-media-video {
}

[data-cognigy-webchat-root] .messenger-media-audio {
}
```

### List

* *messenger-list-container*  
The container element of the List, we could remove the border-radius that comes with it.
```CSS
[data-cognigy-webchat-root] .messenger-list-container {
  border-radius: 0;
}
```
* *messenger-list-header*  
This is the header element, which is above all other componets of the list.
```CSS
[data-cognigy-webchat-root] .messenger-list-header {
  heigth: 200px;
}
```
* *messenger-list-header-content*  
The content of the header, here you can center all elements for example.
```CSS
[data-cognigy-webchat-root] .messenger-list-header-content {
  text-align: center;
}
```
* *messenger-list-header-title*  
The title of the header element.
```CSS
[data-cognigy-webchat-root] .messenger-list-header-title {
  color: greeen;
}
```
* *messenger-list-header-subtitle*  
The subtitle of the header element.
```CSS
[data-cognigy-webchat-root] .messenger-list-header-subtitle {
  color: green;
}
```
* *messenger-list-header-button*  
This is the button inside the header, it can look better if you add some hovering effects.
```CSS
[data-cognigy-webchat-root] .messenger-list-header-button {
  background: #ffd803;
  color: #272343;
}

[data-cognigy-webchat-root] .messenger-list-header-button:hover {
  background: #cfb000;
}
```
* *messenger-list-element*  
The element that contains a single list element
```CSS
[data-cognigy-webchat-root] .messenger-list-element {
  background: #e3f6f5;
}
```
* *messenger-list-element-title*  
The title in every list element.
```CSS
[data-cognigy-webchat-root] .messenger-list-element-title {
  color: yellow;
}
```
* *messenger-list-element-subtitle*  
The subtitle in every list element.
```CSS
[data-cognigy-webchat-root] .messenger-list-element-subtitle {
  color: yellow;
}
```
* *messenger-list-element-button*  
This is the button inside every list element, adding some hovering effects or animation can make it look better.
```CSS
[data-cognigy-webchat-root] .messenger-list-element-button {
  border-color: #ffd803;
  background-color: #fffffe;
  color: #272343;
}

[data-cognigy-webchat-root] .messenger-list-element-button:hover {
  background-color: #cfb00071;   
}
```
