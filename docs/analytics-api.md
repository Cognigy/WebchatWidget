# Analytics API
You can register to a set of various events that occur within the Webchat, from data flows like "a message was received from Cognigy" to interactions like "persistent menu was closed".  
To do that, use the `webchat.registerAnalyticsService` function to execute a callback when events occur:
```javascript
webchat.registerAnalyticsService(event => {
    // react to the event that ocurred
});
```
Anytime an event is being emitted within the Webchat, it will cause the passed callback function to be executed.
The `event` object will always have a `type` property and may have a `payload` property depending on the event.
By checking for `event.type`, you can filter events for the ones you are interested in.


## Webchat Events
| Type | Payload | Description |
| - | - | - |
| `webchat/open` | - | The webchat was opened |
| `webchat/close` | - | The webchat was closed |
| `webchat/incoming-message` | `{ text, data }` | A message was received from Cognigy |
| `webchat/outgoing-message` | `{ text, data }` | A message was sent to Cognigy |
| `plugin/text-input/open-persistent-menu` | - | The persistent menu was opened |
| `plugin/text-input/close-persistent-menu` | - | The persistent menu was closed |
| `plugin/text-input/click-persistent-menu-item` | `{ text }` | A persistent menu item was clicked |
| `plugin/messenger/action` | `Object` | An action was triggered from a Webchat or Messenger Template | 

If you e.g. want to react to incoming messages from Cognigy, you can do it like this:
```javascript
webchat.registerAnalyticsService(event => {
    if (event.type === "webchat/incoming-messsage") {
        console.log("incoming message: " + event.payload.text);
    }
});
```

See it in action:  
[![Edit Analytics API](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/using-the-webchat-api-ho5nk?fontsize=14&hidenavigation=1&theme=dark)
