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
## Messenger messages customization

Our Webchat ships with "Facebook-Messenger-like" message templates out of the box (Quick replies, Buttons, Image Galleries, Media, Lists) this elements can be also customized to meet all design guidelines even more! Here are the classes that you can use to modify it:

See it in action:


### Quick Replies
### Buttons
### Image Gallery
### Media
### List
