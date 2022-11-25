# Embedding the Cognigy Webchat

## Basic Implementation

To integrate the Webchat into a Website, you need to

1. load the `webchat.js` bundle via a `<script>` tag
2. initialize the Webchat towards a Cognigy Endpoint using `initWebchat()`

See it in action:  
[![Edit Basic Implementation](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/basic-cognigy-webchat-embedding-ict1u?fontsize=14&hidenavigation=1&theme=dark)

## Using File Compression

The Webchat Widget offers compressed file versions that can be used to reduce the amount of data that is delivered to the user and reduce site loading time.

To use file compression you need to

1. build the files using `npm run build`
2. copy the `.js.gz` files for Gzip compression and `.js.br` for Brotli compression to the same folder you store your `.js` files in
3. enable compression on your webserver

compression can be enabled for most common web servers but the implementation depends on your used software, middleware and implementation.

## Using a Compatiblity Build

For older browsers, we ship a seperate build of the Webchat called `webchat.legacy.js`, which comes with extra compatibility at the cost of increased size.

| Browser           | Version |
| ----------------- | ------- |
| Google Chrome     | `>= 63` |
| Firefox           | `>= 55` |
| Microsoft Edge    | `>= 15` |
| Internet Explorer | `>= 11` |
| Safari            | `>= 9`  |

See it in action:  
[![Edit Using a Compatibility Build](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/embedding-the-cognigy-webchat-yu1yg?fontsize=14&hidenavigation=1&theme=dark)

## Using Webchat Plugins

To make use of Webchat Plugins, you have to load them via `<script>` tags AFTER loading the `webchat.js` / `webchat.legacy.js` and BEFORE calling `initWebchat()`

See it in action:  
[![Edit Using Webchat Plugins](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/embedding-the-cognigy-webchat-1p6ky?fontsize=14&hidenavigation=1&theme=dark)

## Client-Side Configuration

You can pass [Webchat Options](#webchat-options) as an additional argument to the `initWebchat()` function which can customize the way the Webchat connects to Cognigy as well as override the Settings from your Endpoint.

### Webchat Options

| Name              | Type                                    | Default                                          | Description                                                                                                      |
| ----------------- | --------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| userId            | string                                  | random string[<sup>1</sup>](#persistent-user-id) | The user's id                                                                                                    |
| sessionId         | string                                  | random string                                    | The session's id                                                                                                 |
| channel           | string                                  | `"webchat-client"`                               | The name of your client. Can be useful for analytics                                                             |
| reconnection      | boolean                                 | `true`                                           | If `true`, will try to re-establish the connection after losing it                                               |
| reconnectionLimit | number                                  | `5`                                              | Limit the maximum number of reconnection attempts, `0` means no limit                                            |
| interval          | number                                  | `10000`                                          | Interval time in miliseconds the webchat will wait inbetween polls when falling back to HTTP polling.            |
| forceWebsockets   | boolean                                 | auto-determined by runtime-environment           | If `true`, the client will only use websockets and not fall back to http polling (wins over `disableWebsockets`) |
| disableWebsockets | boolean                                 | false                                            | If `true`, the client will only use http polling and will not try to upgrade to websockets                       |
| settings          | [Endpoint Settings](#endpoint-settings) | -                                                | Can be used to (partially) override certain Settings from the Webchat Endpoint                                   |

<sup id="persistent-user-id">1</sup> The `userId` will be randomly generated on first page load and then persisted user via `LocalStorage`. When that user reloads the page, the Webchat will re-use the `userId` from `LocalStorage`.

See it in action:  
[![Edit Custom Webchat Options](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/embedding-the-cognigy-webchat-4xkv8?fontsize=14&hidenavigation=1&theme=dark)

### Endpoint Settings

| Name                                | Type                                | Default                            | [UI Config](#UI-Configurable) | [Demo Exclusive](#Demo-Page-Settings) | [Updatable](#Safe-To-Update)    | Description                                                                                                                                                                                                     |
| ----------------------------------- | ----------------------------------- | ---------------------------------- | ----------------------------- | ------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| agentAvatarUrl                      | string                              | undefined                          | x                             |                                       |                                 | A custom avatar that sould be displayed next to agent messages                                                                                                                                                  |
| colorScheme                         | string                              | #2C6CAF                            | x                             |                                       |                                 | The background color of the header and bot messages in the Webchat.                                                                                                                                             |
| designTemplate                      | 1 or 2                              | 1                                  | x                             | x                                     |                                 | The Webchat design template to use. We default to design template 1 (bottom right with a button), you can switch to template 2, which is the centered webchat.                                                  |
| disableBranding                     | boolean                             | false                              |                               |                                       |                                 | If true, hides "Powered by Cognigy" link                                                                                                                                                                        |
| enableCustomBranding                     | boolean                             | false                              |                               |                                       |                                 | If true, shows a custom branding instead of the standard one                                                                                                                                                              |
| customBrandingTitle                     | string                             | ""                              |                               |                                       |                                 | The title of the custom branding, such as "Please find our Privacy Policy here"                                                                                                                                                       |
| customBrandingURL                     | string                             | ""                              |                               |                                       |                                 | The optional URL that will be opened when a user clicks on the custom branding title.                                                                                                                                                    |
| disableDefaultReplyCompatiblityMode | boolean                             | false                              |                               |                                       |                                 | If this is set to true, the webchat will not try to look for messenger content in `data._data._cognigy`. This can lead to issues with structured content in Intent Default Replies.                             |
| disableHtmlContentSanitization      | boolean                             | false                              | x                             |                                       |                                 | If true, will disable the removal of potentially malicious tags/attributes when rendering HTML content (applies to default message plugins!)                                                                    |
| disableHtmlInput                    | boolean                             | false                              |                               |                                       |                                 | If true, strips all html tags out from the input of the user.                                                                                                                                                   |
| disableInputAutocomplete            | boolean                             | false                              | x                             | x                                     |                                 | If true, disabled the autosuggestions from e.g. mobile touch keyboards.                                                                                                                                         |
| disableInputAutofocus               | boolean                             | false                              |                               |                                       |                                 | By default, the input will automatically focus when a user opens the widget. If you set this to true, the input will no longer focus when opening the widget.                                                   |
| disableInputAutogrow                | boolean                             | false                              |                               |                                       |                                 | If true, multiline input is disabled and long messages will scroll horizontally                                                                                                                                 |
| disableLocalStorage                 | boolean                             | false                              |                               |                                       |                                 | If true, disables storing any information in browsers storage like persistent history and userId. This flag has a higher priority than `useSessionStorage` - setting this to true also disables SessionStorage. |
| disablePersistentHistory            | boolean                             | false                              |                               |                                       |                                 | If true, disables storing of the chat history into LocalStorage (used for persistence).                                                                                                                         |
| disableUrlButtonSanitization        | boolean                             | false                              | x                             |                                       |                                 | If true, will disable sanitization on "URL Button URLs" and "Default Action URLs" (applies to default message plugins!)                                                                                         |
| disableTextInputSanitization        | boolean                             | false                              |                               |                                       |                                 | By default, text inputs from the user will be sanitized for HTML with scripting. If you set this to true, users can send any kind of HTML text, including script-tags and onload-attributes etc.                |
| dynamicImageAspectRatio             | boolean                             | false                              |                               |                                       |                                 | If true, images from the "gallery", "attachment" or "top list item" template will not have a forced aspect ratio and will be fully displayed full-width without cropping                                        |
| enableConnectionStatusIndicator     | boolean                             | true                               |                               |                                       |                                 | Whether to show a warning if the connection is lost during a conversation. The warning will disappear when the connection is re-established.                                                                    |
| enableAutoFocus                     | boolean                             | false                              |                               |                                       |                                 | If true, focus will be automatically moved to the first focusable element within the latest incoming message. Ths focus will only be moved when the focus is currently on an element within the chat log.       |
| enableInjectionWithoutEmptyHistory  | boolean                             | false                              |                               |                                       |                                 | If true, will not prevent the auto-inject start behavior from being triggered if the history is not empty                                                                                                       |
| enableFocusTrap                     | boolean                             | false                              |                               |                                       |                                 | If true, elements outside the chat window will not be focusable during keyboard navigation when the chat window is open                                                                                         |
| enableGenericHTMLStyling            | boolean                             | false                              |                               |                                       |                                 | If true, will apply generic CSS styling rules to the HTML content of regular text messages                                                                                                                      |
| enableInputCollation                | boolean                             | false                              |                               |                                       |                                 | If true, will artificially delay messages written via the regular text input and will combine and send them as one collated message after 1 second of inactivity                                                |
| enablePersistentMenu                | boolean                             | false                              | x                             |                                       |                                 | Whether to enable the Persistent Menu                                                                                                                                                                           |
| enableRating                        | 'always' , 'once' , 'onRequest'     | 'onRequest'                        |                               |                                       |                                 | 'onRequest' will only show a rating prompt when requested from the Flow. 'always' will always show a rating button in the webchat-toolbar. 'once' only shows the button only until a rating was given.          |
| enableStrictMessengerSync           | boolean                             | false                              |                               |                                       |                                 | If set to true, will NOT render the message from the "Messenger" tab in the SAY node unless "Use Facebook Channel" is checked in the "Webchat" tab.                                                             |
| enableSTT                           | boolean                             | false                              | x                             | x                                     |                                 | Whether to load the speech input plugin.                                                                                                                                                                        |
| enableTTS                           | boolean                             | false                              | x                             | x                                     |                                 | Whether to load the speech output plugin.                                                                                                                                                                       |
| enableTypingIndicator               | boolean                             | true                               | x                             |                                       |                                 | Whether to enable typing indicators in the Webchat when the Conversational AI is replying. Requires a messageDelay to be set.                                                                                   |
| enableUnreadMessageBadge            | boolean                             | false                              |                               |                                       |                                 | If true, the webchat shows a badge with the number of unread messages at the toggle button                                                                                                                      |
| enableUnreadMessagePreview          | boolean                             | false                              |                               |                                       | x                               | If true, the webchat shows a message bubble with the latest retrieved bot message.                                                                                                                              |
| enableUnreadMessageSound            | boolean                             | false                              | x                             |                                       |                                 | If true, plays a notification sound for each incoming unread message                                                                                                                                            |
| enableUnreadMessageTitleIndicator   | boolean                             | false                              |                               |                                       |                                 | If true, will indicate the amount of unread messages in the page title every 1000ms                                                                                                                             |
| engagementMessageText               | string                              | ""                                 |                               |                                       |                                 | The text of the message to display next to the webchat icon to get the user to engage.                                                                                                                          |
| focusInputAfterPostback             | boolean                             | false                              |                               |                                       |                                 | If true, the message input field will receive focus after a Postback button or quick reply button is clicked                                                                                                    |
| getStartedText                      | string                              | ""                                 | x                             |                                       | [x\*](#Updating-start-behavior) | The visible text of the generated message if `startBehavior` is set to `"button"` or `"injection"`                                                                                                              |
| getStartedData                      | object                              | {}                                 | x                             |                                       | [x\*](#Updating-start-behavior) | The invisible data of the generated message if `startBehavior` is set to `"button"` or `"injection"`                                                                                                            |
| getStartedPayload                   | string                              | ""                                 | x                             |                                       | [x\*](#Updating-start-behavior) | The actual text payload of the generated message if `startBehavior` is set to `"button"` or `"injection"`                                                                                                       |
| getStartedButtonText                | string                              | ""                                 | x                             |                                       | [x\*](#Updating-start-behavior) | The label of the "get started button" if `startBehavior` is set to `"button"`                                                                                                                                   |
| ignoreLineBreaks                    | boolean                             | false                              | x                             |                                       |                                 | Whether to ignore line breaks in the Messenger Generic Templates, Gallery Cards Subtitle.                                                                                                                       |
| inputAutogrowMaxRows                | number                              | 5                                  |                               |                                       |                                 | Configures the maximum amount of lines that the regular input textfield will grow to. Adding more content or lines will result in a scrollbar.                                                                  |
| inputCollationTimeout               | number                              | 1000                               |                               |                                       |                                 | Configures the amout of time after which collated messages are automatically being submit (if using the `enableInputCollation` option)                                                                          |
| inputPlaceholder                    | string                              | "Write a reply"                    | x                             |                                       |                                 | The placeholder text to display in the input field.                                                                                                                                                             |
| messageLogoUrl                      | string                              | COGNIGY.AI Logo                    | x                             |                                       |                                 | A custom avatar that should be displayed next to bot messages. Defaults to a COGNIGY.AI logo.                                                                                                                   |
| persistentMenu                      | [Persistent Menu](#persistent-menu) | -                                  | x                             |                                       |                                 | The Persistent Menu to render in the Webchat.                                                                                                                                                                   |
| ratingTitleText                     | string                              | "Please rate your chat experience" |                               |                                       |                                 | The title displayed in the rating dialog prompt.                                                                                                                                                                |
| ratingCommentText                   | string                              | "Feel free to leave a comment."    |                               |                                       |                                 | The text displayed above the comment field in the rating dialog prompt.                                                                                                                                         |
| ratingMessageHistoryRatingText      | string                              | "You gave the following rating:"   |                               |                                       |                                 | The text displayed in the message history after giving a rating (text is followed by the icon representing the rating)                                                                                          |
| ratingMessageHistoryCommentText     | string                              | "You commented:"                   |                               |                                       |                                 | The text displayed in the message history after giving a rating, if there was a comment sent (text is followed by the actual comment)                                                                           |
| showEngagementMessagesInChat        | boolean                             | false                              |                               |                                       |                                 | If this is true, then engagement messages will also be shown in the chat window                                                                                                                                 |
| startBehavior                       | 'none' , 'button', 'injection'      | 'none'                             | x                             |                                       |                                 | If 'none', will start the webchat with a text input, 'button' will display a get started button with a preconfigured message, 'injection' will automatically send a message to the bot.                         |
| title                               | string                              | Cognigy Webchat                    | x                             |                                       |                                 | The text that will be shown in the title bar of the Webchat                                                                                                                                                     |
| unreadMessageTitleText              | string                              | "New Message"                      | x                             |                                       |                                 | The website title that is displayed when the user retrieved one new message                                                                                                                                     |
| unreadMessageTitleTextPlural        | string                              | "New Messages"                     | x                             |                                       |                                 | The website title that is displayed when the user retrieved more than one new message                                                                                                                           |
| userAvatarUrl                       | string                              | undefined                          | x                             |                                       |                                 | A custom avatar that should be displayed next to user messages. Defaults to a user icon.                                                                                                                        |
| useSessionStorage                   | boolean                             | false                              |                               |                                       |                                 | If true, to store chat history and userId sessionStorage is used instead of localStorage. Note: This means the userId will not be persisted after closing and re-opening a browser tab.                         |

##### UI Configurable

These settings can be controlled by a graphical input within the Endpoint editor

##### Demo Page Settings

These settings only take effect on the integrated Demo page reachable through the "OPEN WEBCHAT" button in the Endpoint editor.

##### Safe to Update

These settings were designed to be used and tested with the [`updateSettings`](./webchat-api.md#update-settings) API.
The list of "safe to update" features will be expanded over time.

###### Updating Start Behavior

These properties can be updated, but will only have effect if the "injection" message was not sent yet / the "button" was not clicked yet.

See it in action:  
[![Edit Override Endpoint Settings](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/embedding-the-cognigy-webchat-bpz1r?fontsize=14&hidenavigation=1&theme=dark)

#### Persistent Menu

| Name      | Type                                                    | Default | Description                                               |
| --------- | ------------------------------------------------------- | ------- | --------------------------------------------------------- |
| title     | string                                                  | `""`    | The title of the Persistent Menu                          |
| menuItems | Array of [Persistent Menu Items](#persistent-menu-item) | `[]`    | A List of Items that should appear in the Persistent Menu |

#### Persistent Menu Item

| Name    | Type   | Default | Description                                                          |
| ------- | ------ | ------- | -------------------------------------------------------------------- |
| title   | string | `""`    | The label of the Persisted Menu Item and visible Text on the Message |
| payload | string | `""`    | The actual text message that should be sent                          |

#### Unread Messages Preview

If the website title should display, that the virtual agent sent a new message, the following configuration could be used:

```js
{
  settings: {
    unreadMessageTitleText: "New message",
    unreadMessageTitleTextPlural: "New messages",
    enableUnreadMessageTitleIndicator: true,
    enableUnreadMessageSound: true
  }
}
```

See it in action:  
[![Edit Override Endpoint Settings](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/unread-message-preview-oubyf?fontsize=14&hidenavigation=1&theme=dark)
