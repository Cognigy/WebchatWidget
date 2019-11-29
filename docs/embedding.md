# Embedding the Cognigy Webchat

## Basic Implementation
To integrate the Webchat into a Website, you need to
1. load the `webchat.js` bundle via a `<script>` tag
2. initialize the Webchat towards a Cognigy Endpoint using `initWebchat()`

See it in action:  
[![Edit Basic Implementation](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/basic-cognigy-webchat-embedding-ict1u?fontsize=14&hidenavigation=1&theme=dark)

## Using a Compatiblity Build
For older browsers, we ship a seperate build of the Webchat called `webchat.legacy.js`, which comes with extra compatibility at the cost of increased size.

| Browser | Version |
| - | - |
| Google Chrome | `>= 63` |
| Firefox | `>= 55` |
| Microsoft Edge | `>= 15` |
| Internet Explorer | `>= 11` |
| Safari | `>= 9` |

See it in action:  
[![Edit Using a Compatibility Build](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/embedding-the-cognigy-webchat-yu1yg?fontsize=14&hidenavigation=1&theme=dark)


## Using Webchat Plugins
To make use of Webchat Plugins, you have to load them via `<script>` tags AFTER loading the `webchat.js` / `webchat.legacy.js` and BEFORE calling `initWebchat()`

See it in action:  
[![Edit Using Webchat Plugins](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/embedding-the-cognigy-webchat-1p6ky?fontsize=14&hidenavigation=1&theme=dark)

## Client-Side Configuration
You can pass [Webchat Options](#webchat-options) as an additional argument to the `initWebchat()` function which can customize the way the Webchat connects to Cognigy as well as override the Settings from your Endpoint.

### Webchat Options
| Name | Type | Default | Description |
| - | - | - | - |
| userId | string | random string[<sup>1</sup>](#persistent-user-id) | The user's id |
| sessionId | string | random string | The session's id |
| channel | string | `"webchat-client"` | The name of your client. Can be useful for analytics
| reconnection | boolean | `true` | If `true`, will try to re-establish the connection after losing it
| interval | number | `1000` | Interval time in miliseconds the webchat will wait inbetween polls when falling back to HTTP polling.
| forceWebsockets | boolean | `false` | Rule whether to allow fallbacks to HTTP polling when Websockets are not available
| settings | [Endpoint Settings](#endpoint-settings) | - | Can be used to (partially) override certain Settings from the Webchat Endpoint

<sup id="persistent-user-id">1</sup> The `userId` will be randomly generated on first page load and then persisted user via `LocalStorage`. When that user reloads the page, the Webchat will re-use the `userId` from `LocalStorage`.

See it in action:  
[![Edit Custom Webchat Options](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/embedding-the-cognigy-webchat-4xkv8?fontsize=14&hidenavigation=1&theme=dark)

### Endpoint Settings
| Name | Type | Default | Description |
| - | - | - | - |
| startBehavior | 'none' , 'button', 'injection' | 'none' | If 'none', will start the webchat with a text input, 'button' will display a get started button with a preconfigured message, 'injection' will automatically send a message to the bot. 
| getStartedText | string | "Get Started" | The text to display in the Webchat when clicking the Get Started Button / when sending the auto message. | getStartedPayload | string | "GET_STARTED" | The payload to send to your Flow when clicking the Get Started Button / when sending the auto message. 
| getStartedButtonText | string | "GET_STARTED" | The text to display on the Get Started Button / when sending the auto message. 
| inputPlaceholder | string | "Write a reply" | The placeholder text to display in the input field. 
| enableSTT | boolean | false | Whether to enable speech input that lets the user speak to the Webchat instead of only typing. 
| enableTTS | boolean | false | Whether to enable the browser to read the bot messages aloud. 
| colorScheme | string | The background color of the header and bot messages in the Webchat. | designTemplate | 1 or 2 | 1 | The Webchat design template to use. We default to design template 1 (bottom right with a button), you can switch to template 2, which is the centered webchat. 
| messageLogoUrl | string | COGNIGY.AI Logo | The logo to display next to the messages from your bot in the Webchat. Defaults to a COGNIGY.AI logo. 
| headerLogoUrl | string | COGNIGY.AI Logo | The logo to display in the header of the Webchat. Defaults to a COGNIGY.AI logo. 
| enableConnectionStatusIndicator | boolean | false | Whether to show a warning if the connection is lost during a conversation. The warning will disappear when the connection is re-established. | enableTypingIndicator | boolean | true | Whether to enable typing indicators in the Webchat when the Conversational AI is replying. Requires a messageDelay to be set. 
| enablePersistentMenu | boolean | false | Whether to enable the Persistent Menu 
| persistentMenu | [Persistent Menu](#persistent-menu) | - | The Persistent Menu to render in the Webchat.

See it in action:  
[![Edit Override Endpoint Settings](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/embedding-the-cognigy-webchat-bpz1r?fontsize=14&hidenavigation=1&theme=dark)

#### Persistent Menu
| Name | Type | Default | Description |
| - | - | - | - |
| title | string | `""` | The title of the Persistent Menu |
| menuItems | Array of [Persistent Menu Items](#persistent-menu-item) | `[]` | A List of Items that should appear in the Persistent Menu

#### Persistent Menu Item
| Name | Type | Default | Description |
| - | - | - | - |
| title | string | `""` | The label of the Persisted Menu Item and visible Text on the Message |
| payload | string | `""` | The actual text message that should be sent |