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

## Content-Security-Policy (CSP)

When embedding Webchat within a website implementing a stricter
security environment, the CSP should be extended
to allow connections to the Cognigy AI Endpoint host.
(Note: Endpoint URL is the first parameter to the initWebchat function)

webchat.js, plugins and webchat initialization code need to be allowed
to execute. Note: Webchat plugins can have their own CSP requirements.

## Using Webchat Plugins

To make use of Webchat Plugins, you have to load them via `<script>` tags AFTER loading the `webchat.js` / `webchat.legacy.js` and BEFORE calling `initWebchat()`

See it in action:  
[![Edit Using Webchat Plugins](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/embedding-the-cognigy-webchat-1p6ky?fontsize=14&hidenavigation=1&theme=dark)

## Client-Side Configuration

You can pass [Webchat Options](#webchat-options) as an additional argument to the `initWebchat()` function which can customize the way the Webchat connects to Cognigy as well as override the Settings from your Endpoint.

### Webchat Options

| Name                       | Type                                    | Default                                          | Description                                                                                                               |
| -------------------------- | --------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| userId                     | string                                  | random string[<sup>1</sup>](#persistent-user-id) | The user's id                                                                                                             |
| sessionId                  | string                                  | random string                                    | The session's id                                                                                                          |
| channel                    | string                                  | `"webchat-client"`                               | The name of your client. Can be useful for analytics                                                                      |
| reconnection               | boolean                                 | `true`                                           | If `true`, will try to re-establish the connection after losing it                                                        |
| reconnectionLimit          | number                                  | `5`                                              | Limit the maximum number of reconnection attempts, `0` means no limit                                                     |
| interval                   | number                                  | `10000`                                          | Interval time in miliseconds the webchat will wait inbetween polls when falling back to HTTP polling.                     |
| forceWebsockets            | boolean                                 | auto-determined by runtime-environment           | If `true`, the client will only use websockets and not fall back to http polling (wins over `disableWebsockets`)          |
| disableWebsockets          | boolean                                 | false                                            | If `true`, the client will only use http polling and will not try to upgrade to websockets                                |
| enableInnerSocketHandshake | boolean                                 | false                                            | If `true`, the client will pass `userId`, `sessionId` and `URLToken` through a socket handshake instead of via URL params |
| settings                   | object, see [Endpoint Settings](#endpoint-settings) | -                                                | Can be used to (partially) override certain Settings from the Webchat Endpoint                                            |

<sup id="persistent-user-id">1</sup> The `userId` will be randomly generated on first page load and then persisted user via `LocalStorage`. When that user reloads the page, the Webchat will re-use the `userId` from `LocalStorage`.

See it in action:  
[![Edit Custom Webchat Options](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/embedding-the-cognigy-webchat-4xkv8?fontsize=14&hidenavigation=1&theme=dark)

### Endpoint Settings
See the [Settings Interface](#settings-interface) for full reference.
| Name                       | Type                                    | Default                                          | Description          |
| -------------------------- | --------------------------------------- | ------------------------------------------------ | --- |
| layout  | object   | see [Layout](#layout) | Define general look & feel of the Webchat  |
| colors | object | see [Colors](#colors) | Set a new primary color or set other highlight colors  |
| behavior | object | see [Behavior](#behavior) | Configure Webchat behavior, e.g. to disable the typing indicator |
| startBehavior | object | see [Start Behavior](#start-behavior) | Configure the start behavior |
| fileStorageSettings | object | see [File Storage Settings](#file-storage-settings) | Adjust some of the file storage settings. **(Note: To work, file storage must be generally configured through your Cognigy.AI Endpoint)** |
| businessHours | object | see [Business Hours](#business-hours) | Business hours will prevent the user from using the bot if he loads the embedding page out of business hours |
| unreadMessages | object | see [Unread Messages](#unread-messages) | Configure Webchat behavior for unread message indication |
| homeScreen | object | see [Home Screen](#home-screen) | Configure the Home Screen of your Webchat, shown after opening |
| teaserMessage | object | see [Teaser Message](#teaser-message) | Configure the Teaser Message, shown to users while the Webchat is still minimized |
| chatOptions | object | see [Chat Options](#chat-options) | Configure the Chat Options, providing further options to your users |
| privacyNotice | object | see [Privacy Notice](#privacy-notice) | Configure the privacy notice, optionally shown to be accepted by users before any message is sent  |
| fileAttachmentMaxSize | number | 10485760 | The max size for file attachments uploaded by users **in bytes**, set to **10MB** as default |
| maintenance | object | see [Maintenance](#maintenance)  | Configures the maintenance mode to prevent the user from using the Webchat during maintenance |
| demoWebchat | object | see [Demo Webchat](#demo-webchat) | Configure the Cognigy.AI demo webchat. Only relevant if you copy the Demo Webchat implementation. |
| embeddingConfiguration | object | see [Embedding Configuration](#embedding-configuration) | Settings related to the Webchat browser embedding. **Not configurable via Endpoint Editor** |
| widgetSettings | object | see [Widget Settings](#widget-settings) | Additional Settings to configure the webchat widget behavior. **Not configurable via Endpoint Editor** |

See it in action:  
[![Edit Override Endpoint Settings](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/override-endpoint-settings-5gqm6g?file=%2Findex.html)

#### Layout
| Name | Type | Default | Description |
| - | - | - | - |
| title | string | `""` | The text that will be shown as header title of the Webchat |
| logoUrl | string | `""` | The Logo shown in the header of the Webchat |
| useOtherAgentLogo | boolean | `false` | Enables setting specific names and logos for bot and agent avatars. By default title and logoUrl will be used for the avatars. |
| botAvatarName | string | `""` | Name for the AI Agent avatar which will be displayed above each AI Agent message. |
| botLogoUrl | string | `""` | AI Agent avatar which will be displayed above each AI Agent message. Recommended img size: 28px x 28px |
| agentAvatarName | string | `""` | Name for the Human Agent avatar which will be displayed above each Human Agent message |
| agentLogoUrl | string | `""` | Human Agent avatar which will be displayed above each Human Agent message. Recommended img size: 28px x 28px |
| inputAutogrowMaxRows | number | `4` | Maximum Number of Input Rows  |
| enableInputCollation | boolean | `true` | If enabled, messages will be combined into a single message, dependent on the time set with `inputCollationTimeout` |
| inputCollationTimeout | number | `1000` | timeout value for input collation |
| dynamicImageAspectRatio | boolean | `false` | Use to disable forced aspect ratio for images in chat elements |
| disableInputAutocomplete | boolean | `false` | Use to disable browser autocomplete for the input field |
| enableGenericHTMLStyling | boolean | `false` | If this is active, additional generic styling will be applied to HTML content inside regular text messages. |
| disableHtmlContentSanitization | boolean | `false` | By default, potentially malicious HTML content like 'onclick' or 'onload' attributes are removed before rendering.  |
| disableUrlButtonSanitization | boolean | `false` | By default, 'JavaScript URLs' starting with javascript: will get removed. |
| watermark | string | `"default"` | Allowed values: `"default" \| "custom" \| "none"` |
| watermarkText | string | `"Powered by Cognigy.AI"` | This will be used if watermark is set to custom |

#### Colors
| Name | Type | Default | Description |
| - | - | - | - |
| primaryColor | string | `""` | Primary color |
| secondaryColor | string | `""` | Secondary color |
| chatInterfaceColor | string | `""` | Chat interface background color|
| botMessageColor | string | `""` | AI Agent messages background color |
| userMessageColor | string | `""` | User messages background color |
| textLinkColor | string | `""` | Text link color |

#### Behavior
| Name | Type | Default | Description |
| - | - | - | - |
| enableTypingIndicator | boolean | `true` | Enables a typing indicator while the AI Agent is replying |
| messageDelay | number | `500` | Wait time between AI Agent messages in miliseconds |
| inputPlaceholder | string | `"Type something…"` | Placeholder for the input field |
| enableSTT | boolean | `false` | Enable speech-to-text |
| enableTTS | boolean | `false` | Enable text-to-speech |
| focusInputAfterPostback | boolean | `false` | Input field will receive focus after a Postback button or quick reply button is clicked |
| enableConnectionStatusIndicator | boolean | `true` | Shows a warning if the connection is lost during a conversation. The warning will disappear when the connection is re-established.  |

#### Start Behavior
| Name | Type | Default | Description |
| - | - | - | - |
| startBehavior | string | `"none"` | Allowed values: `"none" \| "button" \| "injection"` |
| getStartedButtonText | string | `""` | The label of the "get started button" if `startBehavior` is set to `"button"` |
| getStartedData | object | `{}` | The invisible data of the generated message if `startBehavior` is set to `"button"` or `"injection"`  |
| getStartedPayload | string | `""` | The actual text payload of the generated message if `startBehavior` is set to `"button"` or `"injection"`  |
| getStartedText | string | `""` | The visible text of the generated message if `startBehavior` is set to `"button"` or `"injection"` |

#### File Storage Settings
Storage provider settings have to be configured in the connected Cognigy Endpoint
| Name | Type | Default | Description |
| - | - | - | - |
| enabled | boolean | `false` | Enable file upload |
| dropzoneText | string | `""` | Configure the info text for the file dropzone |


#### Business Hours

All business hours settings require the setting `embeddingConfiguration.awaitEndpointConfig` as prerequisite.

| Name          | Type                                                 | Default           | Description                                                                                                                       |
| ------------- | ---------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| enabled       | boolean                                              | `false`           | Enable business hours                                                                                                             |
| mode          | "hide", "disable", "inform"                          | `"inform"`        | Choose to either "hide" the Webchat Widget, "disable" it or "inform" the user when using the Webchat Widget out of business hours |
| text          | string                                               | `""`              | Text that is displayed to users out of business hours                                                                             |
| title         | string                                               | `""`              | Title that is displayed to the user out of business hours if mode is set to "inform". Leave empty for no header                   |
| timeZone      | string                                               | `"Europe/Berlin"` | A timezone from the [`list of supported time zones`](https://gist.github.com/diogocapela/12c6617fc87607d11fd62d2a4f42b02a)        |
| times| array of [Busines Hours Items](#business-hours-item) | `[]`              | An array of business hours during which the bot will be available                                                                 |

#### Business Hours Item

| Name      | Type   | Default                                                                                    | Description                                                |
| --------- | ------ | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| startTime | string | `""`                                                                                       | The starting time of the business hours, e.g. `08:00`      |
| endTime   | string | `""`                                                                                       | The end time of the business hours e.g. `17:00`            |
| weekDay   | string | `"monday"`, `"tuesday"`, `"wednesday"`, `"thursday"`, `"friday"`, `"saturday"`, `"sunday"` | The day of the week when the business hours will be active |


#### Unread Messages
| Name | Type | Default | Description |
| - | - | - | - |
| enableIndicator | boolean | `false` | Enable to indicate the amount of unread messages in the page title (updated once every second) |
| enableBadge | boolean | `false` | Enable to show a badge with the number of unread messages on the Webchat toggle button |
| enablePreview | boolean | `false` | Enable to show a message bubble with the latest retrieved bot message  |
| enableSound | boolean | `false` | Enable to play a notification sound for each incoming unread message |

#### Home Screen
| Name | Type | Default | Description |
| - | - | - | - |
| enabled | boolean | `true` | Enables the Home Screen feature  |
| welcomeText | string | `"Welcome! How can we help you?"` | Welcome text on the home screen |
| background | object | [Home Screen Background](#home-screen-background) | Configure the Home Screen background |
| startConversationButtonText | string | `"Start conversation"` | Configure the text shown on the "Start Conversation" button |
| previousConversations | object | [Previous Conversations](#previous-conversations) | Configure the Previous Conversations feature |
| conversationStarters | object | [Conversation Starters](#conversation-starters) | Configure Conversation Starters on the Home Screen |

##### Home Screen Background
| Name | Type | Default | Description |
| - | - | - | - |
| imageUrl | string | `""` | Background image for the home screen. Can be used together with `color`, the image will be rendered on top. |
| color | string | `""` | CSS color code or gradient |

##### Previous Conversations
| Name | Type | Default | Description |
| - | - | - | - |
| enabled | boolean | `true` | If enabled, the "Previous Conversations" button is shown on the Home Screen  |
| buttonText | string | `"Previous conversations"` | Configure the "Previous Conversations" button |
| title | string | `""` | Configure the Header of the "Previous Conversations" page |

##### Conversation Starters
| Name | Type | Default | Description |
| - | - | - | - |
| enabled | boolean | `true` |  |
| starters | array of [Action Buttons](#action-button) | `[]` | Configure action buttons to show on the Home Screen |

##### Action Button
| Name | Type | Example | Description |
| - | - | - | - |
| type | string | `"web_url"` | Allowed types: `"postback" \| "web_url" \| "phone_number"` |
| title | string | `"Open Homepage"` | Button title |
| url? | string | `"https://homepage.com"` | Button opens this url in a new tab. Provide url if type is `web_url` |
| payload? | string | - | If type is `postback`: Button sends the payload as an input. <br> If type is `phone_number`: Button triggers the browsers "tel:" link function. |

#### Teaser Message
| Name | Type | Default | Description |
| - | - | - | - |
| text | string | `""` | Message displayed above Webchat icon for user engagement |
| showInChat | boolean | `false` | Enable to also show the Teaser Message text in the chat window |
| conversationStarters | object | [Conversation Starters](#conversation-starters) | Configure Conversation Starters, each will be an action button below the Teaser Message |

#### Chat Options
| Name | Type | Default | Description |
| - | - | - | - |
| enabled | boolean | `false` | Enable Chat Options Feature |
| title | string |  `"Chat Options"` | Chat Options header title |
| quickReplyOptions | object | [Quick Reply Options](#quick-reply-options) | Configure the Quick Reply section in the Chat Options |
| showTTSToggle | boolean | `false` | Enable to show the Text-to-Speech Toggle |
| activateTTSToggle | boolean | `true` | Activate Text-to-Speech Toggle by default if enabled |
| labelTTSToggle | string | `"Enable text-to-speech"` | Label for the Text-to-Speech toggle |
| rating | object | [Rating Section](#chat-options-rating-section) | Configure the Rating Section |
| footer | object | [Footer](#chat-options-footer) | Configure the Footer |

##### Quick Reply Options
| Name | Type | Default | Description |
| - | - | - | - |
| enabled | boolean | `true` | Enable quick replies in the Chat Options |
| sectionTitle | string | `"People are also interested in"` | Configure the title for the Quick Reply Section |
| quickReplies | array of [Action Buttons](#action-button) | `[]` | Configure action buttons to show as quick replies |

##### Chat Options Rating Section
| Name | Type | Default | Description |
| - | - | - | - |
| enabled | string | `"once"` | Allowed values: `"no" \| "once" \| "always"`. Decide how often a user can give feedback from this section. Hidden not enabled. |
| title | string | `"Please rate your chat experience"` | Configure the title for the Rating Section |
| commentPlaceholder | string | `"Type something here"` | Placeholder text that will be displayed in the rating comment field |
| submitButtonText | string | `"Send feedback"` | Text on the rating submit button |
| eventBannerText | string | `"Your feedback was submitted"` | Event Banner text after user sent feedback  |

##### Chat Options Footer
| Name | Type | Default | Description |
| - | - | - | - |
| enabled | boolean | `false` | Enable the footer section |
| items | array of [Footer Items](#footer-item) | `[]` | Configure up to two Footer items with links, e.g. a link to an Imprint  |

##### Footer Item
| Name | Type | Example | Description |
| - | - | - | - |
| title | string | `"Imprint"` | Title for the Footer Item |
| url | string | `"https://imprint.com"` | URL Link for the Footer Item |

#### Privacy Notice
| Name | Type | Default | Description |
| - | - | - | - |
| enabled | boolean | `false` | If enabled, the user needs to accept a privacy policy before a conversation is started |
| title | string | `"Privacy notice"` | Header title of the Privacy Notice screen |
| text | string | `Please accept our privacy policy to start your chat.` | Configure a Privacy Notice Text to be shown |
| submitButtonText | string | `"Submit"` | Configure the "submit" button text on the Privacy Notice screen |
| urlText | string | `"Privacy policy"` | Text on the link button, linking to your full Privacy Notice |
| url | string | `"https://www.cognigy.com/"` | The URL to your full Privacy Notice |

#### Maintenance
All maintenance settings require the setting `embeddingConfiguration.awaitEndpointConfig` as prerequisite.

| Name    | Type                        | Default    | Description                                                                                                       |
| ------- | --------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------- |
| enabled | boolean                     | `false`    | Enable maintenance mode                                                                                           |
| mode    | string | `"inform"` | Allowed values: `"hide" \| "disable" \| "inform"` <br> Choose to either "hide" the Webchat Widget, "disable" it or "inform" the user about maintenance mode              |
| text    | string                      | `""`       | Text that is displayed to users during maintenance mode                                                           |
| title   | string                      | `""`       | Title that is displayed to the user during maintenance mode if mode is set to "inform". Leave empty for no header |

#### Demo Webchat
| Name | Type | Default | Description |
| - | - | - | - |
| enabled | boolean | `true` | Enables the Demo Webchat |
| backgroundImageUrl | string | `""` | URL to load a background image for the demo webchat |
| position | string | `"centered"` | Allowed values: `"centered" \| "bottomRight"` <br> Set position of the Demo Webchat Widget  |

#### Embedding Configuration
Settings related to the webchat browser embedding. <br>
*These settings are NOT configurable via the Endpoint Editor in Cognigy.AI*
| Name | Type | Default | Description |
| - | - | - | - |
| _endpointTokenUrl | string | `""` | Internal duplicate of WebchatURL, do not change |
| awaitEndpointConfig | boolean | `false` | Await the loading of the endpoint configuration. This setting is a necessary precondition for the settings `maintenance`, `businessHours` and `connectivity` |
| disableLocalStorage | boolean | `false` | If true, disables storing any information in browsers storage like persistent history and userId. This flag has a higher priority than `useSessionStorage` - setting this to true also disables SessionStorage. |
| disablePersistentHistory | boolean | `false` | If true, disables storing of the chat history into LocalStorage (used for persistence) |
| useSessionStorage | boolean | `false` | If true, to store chat history and userId sessionStorage is used instead of localStorage. Note: This means the userId will not be persisted after closing and re-opening a browser tab. |
| connectivity | object | [Connectivity](#connectivity) | Enabling the connectivity handler will prevent the user from using the Webchat Widget if it's unable to load the endpoint configuration within a specified time frame  |

##### Connectivity
All connectivity settings require the setting `embeddingConfiguration.awaitEndpointConfig` as prerequisite.
| Name    | Type                        | Default    | Description                                                                                                                                 |
| ------- | --------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| enabled | boolean                     | `false`    | Enable connectivity issue handling                                                                                                          |
| mode    | 'hide', 'disable', 'inform' | `'inform'` | Choose to either 'hide' the Webchat Widget, 'disable' it or 'inform' the user when the configuration can't be loaded from the endpoint      |
| text    | string                      | `""`       | Text that is displayed to users during connectivity issues                                                                                  |
| title   | string                      | `""`       | Title that is displayed to the user during connectivity issues if mode is set to 'inform'. Leave empty for no header                        |
| timeout | number                      | `2000`     | The maximum time in milliseconds to wait for successful loading of the endpoint configuration before activating connectivity issue handling |

#### Widget Settings
Additional Settings to configure the webchat widget behavior <br>
*These settings are NOT configurable via the Endpoint Editor in Cognigy.AI*
| Name | Type | Default | Description |
| - | - | - | - |
| disableDefaultReplyCompatiblityMode | boolean | `false` | If set to true, the webchat will not try to look for messenger content in data._data._cognigy. This can lead to issues with structured content in Intent Default Replies. |
| enableStrictMessengerSync | boolean | `false` | If set to true, will NOT render the message from the "Messenger" tab in the SAY node unless "Use Facebook Channel" is checked in the "Webchat" tab. |
| disableHtmlInput | boolean | `false` | If true, strips all html tags out from the input of the user. |
| disableInputAutofocus | boolean | `false` | By default, the input will automatically focus when a user opens the widget. If you set this to true, the input will no longer focus when opening the widget. |
| disableRenderURLsAsLinks | boolean | `false` | If true, disables the automatic replacement of URLs in message elements with clickable HTML link elements. |
| disableTextInputSanitization | boolean | `false` | By default, text inputs from the user will be sanitized for HTML with scripting. If you set this to true, users can send any kind of HTML text, including script-tags and onload-attributes etc. |
| disableToggleButton | boolean | `false` | Disable the Webchat Toggle Button |
| enableAutoFocus | boolean | `false` |  If true, focus will be automatically moved to the first focusable element within the latest incoming message. Ths focus will only be moved when the focus is currently on an element within the chat log. |
| enableInjectionWithoutEmptyHistory | boolean | `false` | If true, will not prevent the auto-inject start behavior from being triggered if the history is not empty |
| enableFocusTrap | boolean | `false` | If true, elements outside the chat window will not be focusable during keyboard navigation when the chat window is open |
| enableDefaultPreview | boolean | `false` | Enable default preview for Adaptive cards plugin |
| ignoreLineBreaks | boolean | `false` | Enable to ignore line breaks in the Messenger Generic Templates, Gallery Cards Subtitle |
| STTLanguage | string | `""` | Set the STTLanguage |
| teaserMessageDelay | number | `5000` | Configure the delay for the Teaser Message appearing (in miliseconds) |
| unreadMessageTitleText | string | `"New Message"` | The website title that is displayed when the user retrieved one new message |
| unreadMessageTitleTextPlural | string | `"New Messages"` | The website title that is displayed when the user retrieved more than one new message |
| userAvatarUrl | string | `""` | A custom avatar that should be displayed next to user messages. Default shows no avatar. |
| sourceDirectionMapping | object | [Source Direction Mapping](#source-direction-mapping) | Configure source direction mapping |
| sourceColorMapping | object | [Source Color Mapping](#source-color-mapping) | Configure source color mapping |

#### Source Direction Mapping
| Name | Type | Value |
| - | - | - |
| agent | string | `"incoming" \| "outgoing"` |
| bot | string | `"incoming" \| "outgoing"` |
| engagement | string | `"incoming" \| "outgoing"` |
| user | string | `"incoming" \| "outgoing"` |

#### Source Color Mapping
| Name | Type | Value |
| - | - | - |
| agent | string | `"primary" \| "neutral"` |
| bot | string | `"primary" \| "neutral"` |
| engagement | string | `"primary" \| "neutral"` |
| user | string | `"primary" \| "neutral"` |

#### Settings Interface
The full interface for the Webchat Settings.
_Note: All settings can be optionally loaded, a full object is not required._
```ts
interface IWebchatSettings {
	// Settings that are also configurable via the Endpoint Editor in Cognigy.AI
	layout: {
		title: string;
		logoUrl: string;
		useOtherAgentLogo: boolean;
		botAvatarName: string;
		botLogoUrl: string;
		agentAvatarName: string;
		agentLogoUrl: string;
		inputAutogrowMaxRows: number;
		enableInputCollation: boolean;
		inputCollationTimeout: number;
		dynamicImageAspectRatio: boolean;
		disableInputAutocomplete: boolean;
		enableGenericHTMLStyling: boolean;
		disableHtmlContentSanitization: boolean;
		disableUrlButtonSanitization: boolean;
		watermark: "default" | "custom" | "none";
		watermarkText: string;
	};
	colors: {
		primaryColor: string;
		secondaryColor: string;
		chatInterfaceColor: string;
		botMessageColor: string;
		userMessageColor: string;
		textLinkColor: string;
	};
	behavior: {
		enableTypingIndicator: boolean;
		messageDelay: number;
		inputPlaceholder: string;
		enableSTT: boolean;
		enableTTS: boolean;
		focusInputAfterPostback: boolean;
		enableConnectionStatusIndicator: boolean;
	};
	startBehavior: {
		startBehavior: "none" | "button" | "injection";
		getStartedPayload: string;
		getStartedData: object;
		getStartedText: string;
		getStartedButtonText: string;
	};
	fileStorageSettings: {
		enabled: boolean;
		dropzoneText: string;
	};
	businessHours: {
		enabled: boolean;
		mode: "inform" | "hide" | "disable";
		text: string;
		title: string;
		timeZone: string;
		times: {
			startTime: string;
			endTime: string;
			weekDay: string;
		}[];
	};
	unreadMessages: {
		enableIndicator: boolean;
		enableBadge: boolean;
		enablePreview: boolean;
		enableSound: boolean;
	};
	homeScreen: {
		enabled: boolean;
		welcomeText: string;
		background: {
			imageUrl: string;
			color: string;
		};
		startConversationButtonText: string;
		previousConversations: {
			enabled: boolean;
			buttonText: string;
			title: string;
		};
		conversationStarters: {
			enabled: boolean;
			starters: {
				type: "postback" | "web_url" | "phone_number";
				title: string;
				url: string;
				payload: string;
			}[];
		};
	};
	teaserMessage: {
		text: string;
		showInChat: boolean;
		conversationStarters: {
			enabled: boolean;
			starters: {
				type: "postback" | "web_url" | "phone_number";
				title: string;
				url: string;
				payload: string;
			}[];
		};
	};
	chatOptions: {
		enabled: boolean;
		title: string;
		quickReplyOptions: {
			enabled: boolean;
			sectionTitle: string;
			quickReplies: {
				type: "postback" | "web_url" | "phone_number";
				title: string;
				url: string;
				payload: string;
			}[];
		};
		showTTSToggle: boolean;
		activateTTSToggle: boolean;
		labelTTSToggle: string;
		rating: {
			enabled: "no" | "once" | "always";
			title: string;
			commentPlaceholder: string;
			submitButtonText: string;
			eventBannerText: string;
		};
		footer: {
			enabled: boolean;
			items: {
				title: string;
				url: string;
			}[];
		};
	};
	privacyNotice: {
		enabled: boolean;
		title: string;
		text: string;
		submitButtonText: string;
		urlText: string;
		url: string;
	};
	fileAttachmentMaxSize: number;
	maintenance: {
		enabled: boolean;
		mode: "inform" | "hide" | "disable";
		text: string;
		title: string;
	};
	demoWebchat: {
		enabled: boolean;
		backgroundImageUrl: string;
		position: "centered" | "bottomRight";
	};

	// Settings related to the webchat browser embedding
	// These settings are NOT configurable via the Endpoint Editor in Cognigy.AI
	embeddingConfiguration: {
		_endpointTokenUrl: string;
		awaitEndpointConfig: boolean;
		disableLocalStorage: boolean;
		disablePersistentHistory: boolean;
		useSessionStorage: boolean;
		connectivity: {
			enabled: boolean;
			mode: string;
			text: string;
			timeout: number;
			title: string;
		}
	},

	// Additional Settings to configure the webchat widget behavior
	// These settings are NOT configurable via the Endpoint Editor in Cognigy.AI
	widgetSettings: {
		disableDefaultReplyCompatiblityMode: boolean;
		enableStrictMessengerSync: boolean;
		disableHtmlInput: boolean;
		disableInputAutofocus: boolean;
		disableRenderURLsAsLinks: boolean;
		disableTextInputSanitization: boolean;
		disableToggleButton: boolean;
		enableAutoFocus: boolean;
		enableInjectionWithoutEmptyHistory: boolean;
		enableFocusTrap: boolean;
		enableDefaultPreview: boolean;
		ignoreLineBreaks: boolean;
		STTLanguage: string;
		teaserMessageDelay: number;
		unreadMessageTitleText: string;
		unreadMessageTitleTextPlural: string;
		userAvatarUrl: string;
		sourceDirectionMapping: {
			agent: TSourceDirection;
			bot: TSourceDirection;
			engagement: TSourceDirection;
			user: TSourceDirection;
		};
		sourceColorMapping: {
			agent: TSourceColor;
			bot: TSourceColor;
			engagement: TSourceColor;
			user: TSourceColor;
		};
	};
}
```