# Webchat API
The `initWebchat()` method resolves a `webchat` object as soon as a connection is established, that can be used to access the Webchat's API.

For modern browsers, you can access it like this:
```
initWebchat('...').then(webchat => {
    // use webchat here
})
```

If you plan to support legacy browsers, there is an alternative syntax:
```
initWebchat('...', {}, function (webchat) {
    // use webchat here
})
```

For integrations with Websites, it is recommended to store the `webchat` object in the global window namespace for access all across the Website:
```
initWebchat('...').then(webchat => {
    window.webchat = webchat;
})
```

See it in action:  
[![Edit Using the Webchat API](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/using-the-webchat-api-ppl1v?fontsize=14&hidenavigation=1&theme=dark)

## Opening / Closing the Webchat
You can open the Webchat by calling `webchat.open()` or close it by calling `webchat.close()` at any time once it is loaded.
If you want to toggle the current open / close state, there is also a `webchat.toggle()` method.

[![Edit Opening / Closing the Webchat externally](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/using-the-webchat-api-o227i?fontsize=14&hidenavigation=1&theme=dark)

## Sending Messages
You can use the Webchat API to send messages from outside of the Webchat via `webchat.sendMessage()`.  

### Sending Text Messages
To send text messages, pass the text content as the first argument:
```javascript
webchat.sendMessage("hello world!");
```

### Sending Text and Data Messages
If you want to add data-output to your message, pass it as an object via a second argument, like this:
```javascript
webchat.sendMessage("hello world!", {
    origin: "sendMessage method"
})
```

### Sending Data-Only Messages
In case you want to send a data-only message, pass an empty string as the first argument:
```javascript
webchat.sendMessage("", {
    origin: "sendMessage method"
})
```
Note: By default, data-only messages will be invisible in the Chat History

### Sending a Message with an alternative Label
It is possible to override the visible message text by using a third parameter like this:
```javascript
webchat.sendMessage("hello world!", {}, {
    label: "foobar"
});
```

See it in action:  
[![Edit Sending Messages via the Webchat API](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/using-the-webchat-api-hnd6r?fontsize=14&hidenavigation=1&theme=dark)

## Update Settings
It is possible to update the webchat's settings at runtime using the `updateSettings` function.
It will receive an object as a parameter which will update all provided settings while leaving the remaining settings untouched.
Please note that only a subset of settings are safe to update at runtime. For further information, have a look at the [Endpoint Settings](./embedding.md#endpoint-settings).
```javascript
// this will disabled the unread message preview at runtime
webchat.updateSettings({
  enableUnreadMessagePreview: false
});
```


## Analytics API
Read more on how to register to Webchat events on our seperate, in-depth [Analytics API](./analytics-api.md) Guide.