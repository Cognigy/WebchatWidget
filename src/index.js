// @flow

/* Node modules */
import { h, render, } from 'preact';
import 'whatwg-fetch';
import Promise from 'promise-polyfill';
if (!window.Promise) {
	window.Promise = Promise;
}

/* Custom modules */
import Cognigy from "./web-client-source.js";
import { Helpers } from "./helpers.js";
import { BrowserDetect } from "./browserDetect.js";
import PersistentMenu from "./utils/PersistentMenu.jsx";
import main_css from './index.css';
import rich_message_css from './rich_message_style.css';
import custom_color_css from './custom_colors.css';
import center_webchat_css from './center_webchat.css';


/* Use CSS */
main_css.use();
rich_message_css.use();
custom_color_css.use();
BrowserDetect.init();

const defaultOptions = {
	resetContext: true,
	resetState: true,
	enableTTS: false,
	enableSTT: false,
	enableFileUpload: false,
	userId: window.localStorage.getItem("userId") || generateRandomId(),
	sessionId: generateRandomId(),
	keepMarkup: true,
	displayGetStartedButton: true,
	designTemplate: 1,
	channel: "website",
	enablePersistentMenu: false,
	displayGetStartedButton: true,
	inputPlaceholder: "Write a reply",

	/**
	 * We have to force a websocket connection for Safari,
	 * because they do not support cookie based sticky sessions.
	 * Polling can therefore not work with Traefik.
	 */
	forceWebsockets: BrowserDetect.browser && BrowserDetect.browser.toLowerCase() === "safari"
}

/* This function inits the CognigyClient connection */
async function init(userOptions: any, outputCallback: (output: { text: string, data: any }) => any, exposeClientCallback: (client: Cognigy.CognigyWebClient) => any) {
	/**
	 * 1. Add polyfill for map function. This is required for compatibility with IE
	 */
	// if (!Array.prototype.map) {
	// 	Array.prototype.map = mapPolyfill;
	// }

	/**
	 * 2. Fetch Webchat configuration. The following cases exist:
	 * 
	 * 1. The userOptions is a string. This means that the user has only specified
	 * a config URL that we should use to fetch the entire Webchat configuration.
	 *
	 * 2. The userOptions is an object that contains a configUrl key. In this case, we will
	 * fetch the Webchat configuration from this specified URL. Any other options that are specified as part of the
	 * userOptions object will override the settings in the config that is fetched. This is especially useful to specify userIds.
	 * 
	 * 3. The userOptions is an object that does not contain a configUrl key. In this case
	 * we try to load the Webchat based on the options in the userOptions object and the default options.
	 */
	let options;

	try {
		if (typeof userOptions === "string") {

			/** Fetch the webchat configuration from the userOptions URL */
			const webchatConfigResponse = await window.fetch(userOptions);
			const webchatConfig = await webchatConfigResponse.json();

			/** Create the options object with the following priorization order */
			options = Object.assign({},
				defaultOptions,
				webchatConfig,
				webchatConfig.settings
			);

			/** Get the baseUrl by removing the URLToken from the URL. */
			options.baseUrl = userOptions.split("/").slice(0, -1).join("/");

		} else if (userOptions.configUrl) {

			/** Fetch the webchat configuration from the specified configURL */
			const webchatConfigResponse = await window.fetch(userOptions.configUrl);
			const webchatConfig = await webchatConfigResponse.json();

			/** Create the options object. Any additional settings in the userOptions have highest priority */
			options = Object.assign({},
				defaultOptions,
				webchatConfig,
				webchatConfig.settings,
				userOptions
			);

			/** Get the baseUrl by removing the URLToken from the URL. */
			options.baseUrl = userOptions.configUrl.split("/").slice(0, -1).join("/");

		} else {
			/* Create options object based on userOptions and defaultOptions */
			options = Object.assign({}, defaultOptions, userOptions);
		}

	} catch (error) {
		console.error(`Unable to get Webchat configuration. Error was: ${error}`);
		return;
	}

	if (options.colorScheme && (BrowserDetect.browser === "MSIE" || BrowserDetect.browser === "Microsoft Edge")) {
		(document: any).webchatColor = options.colorScheme;
	};


	/* Explicitly check whether the endpoint is disabled */
	if (options.active === false) {
		alert("This Webchat Endpoint is currently disabled. You can enable it in the COGNIY.AI User Interface.");
	}

	/* Set the userId in localStorage */
	window.localStorage.setItem("userId", options.userId);


	/**
	 * 3. We build the HTML required for the webchat
	 */
	buildHTMLDocument(options);


	/**
	 * 4. We initialize logos, colors and so on based on the user options
	 */

	/* URL to use for file uploads and message logos. */
	let fileUploadUrl = null;
	const messageLogoUrl = options.messageLogoUrl;
	let recording = false;

	/* Check whether we can load the header logo. */
	var img = new Image();
	img.onload = function () {
		var headerLogo = ((document.getElementById("cognigyHeaderLogo"): any): HTMLImageElement);
		headerLogo.src = options.headerLogoUrl;
	}
	img.src = options.headerLogoUrl;

	/* Check whether we have a custom color scheme defined and whether we don't use IE */
	if (options.colorScheme && BrowserDetect.browser !== "MSIE" && BrowserDetect.browser !== "Microsoft Edge") {
		document.documentElement && document.documentElement.style.setProperty("--color", options.colorScheme);
	} else if (options.colorScheme) {
		const colorCollection = document.querySelectorAll(".button_template_container, .button, .list_template_element_button,	.cognigy-persistent-menu-item, .quick_reply");
		changeColor(colorCollection, "color", options.colorScheme);

		const bgColorCollection = document.querySelectorAll(".button_template_text,	.cognigy-chat-state-closed,	.cognigy-chat-state-open, .cognigy-chat-header-container, .cognigy-chat-header-container__open, .cognigy-chat-bot-message");
		changeColor(bgColorCollection, "background-color", options.colorScheme);

		function changeColor(coll: any, key: any, value: any) {
			for (var i = 0, len = coll.length; i < len; i++) {
				coll[i].style[key] = value;
			}
		}
	}

	/* Check whether we should use displayTempalte 2 */
	if (options.designTemplate === 2) {
		center_webchat_css.use();
	}

	/* Create functiont to read cognigyMessages */
	let readCognigyMessage;
	if (options.enableTTS) {
		readCognigyMessage = function (message) {
			if (client && client.isConnected() && message) {
				console.log(message)
				client.say(message);
			}
		}
	} else {
		readCognigyMessage = function () {
			return;
		}
	}

	/**
	 * 5. We initialize the CognigyClient
	 */

	/* Function to call on output from Cognigy AI */
	options.handleOutput = function (output) {

		/* If the user has defined a callback function, then we execute it on each output */
		if (outputCallback) {
			outputCallback(output);
		}

		/* Check whether we have received a url to use for file uploads */
		if (output.data && output.data.fileUploadUrl) {
			fileUploadUrl = output.data.fileUploadUrl;
		}

		/* Display the cognigy message */
		Helpers.displayCognigyMessage(output, messageLogoUrl, readCognigyMessage, handleCognigyMessage);
	}

	const client = new Cognigy.CognigyWebClient(options);

	try {
		await client.connect();

	} catch (error) {
		alert("Error connecting. Please check your connection parameters.");
		console.log(error);
	}

	/**
	 * 6. We initialize functionality for recordings, fileUploads, postBack buttons etc.
	 */

	//Function used by postback buttons
	const handleCognigyMessage = function (message) {
		if (client && client.isConnected() && message) {
			const inputEl = document.getElementById("cognigy-input");
			const inputValue = inputEl && inputEl.textContent;
			if (inputEl) inputEl.textContent = "";
			if (message) {
				client.sendMessage(message, {
					"browser": {
						"browser": BrowserDetect.browser,
						"version": BrowserDetect.version
					}
				});
			} else {
				client.sendMessage(inputValue, {
					"browser": {
						"browser": BrowserDetect.browser,
						"version": BrowserDetect.version
					}
				});
			}
		}
	}

	/* Get Started button functionality */
	if (options.displayGetStartedButton) {
		const getStartedButton = document.getElementById("cognigy-get-started-button");

		/* Check whether we have options to define chat text */
		let getStartedText;
		if (options && options.getStartedText) {
			getStartedText = options.getStartedText;
		} else {
			getStartedText = "Get Started";
		}

		/* Check whether we have options to define postback text */
		let getStartedPayload;
		if (options && options.getStartedPayload) {
			getStartedPayload = options.getStartedPayload;
		} else {
			getStartedPayload = "GET_STARTED";
		}

		if (getStartedButton) getStartedButton.onclick = function () {
			Helpers.handleGetStartedButton(getStartedText, getStartedPayload, handleCognigyMessage);
		}
	} else {
		/* Display input field */
		const formElement = document.getElementById("cognigy-form");
		if (formElement) formElement.className = "cognigy-chat-form";
	}

	// Recording functionality
	const enableSTT = document.getElementById("cognigy-record");

	if (client && client.isConnected) {
		if (enableSTT !== null) {
			enableSTT.onclick = function () {
				recording = !recording;

				enableSTT.style.backgroundImage = (recording) ? "url(https://s3.eu-central-1.amazonaws.com/cognigydev/CognigyWebchat/images/mic-animate.gif)" : "url(https://s3.eu-central-1.amazonaws.com/cognigydev/CognigyWebchat/images/mic.gif)";

				if (recording) {
					// $FlowFixMe
					var beep = new Audio("https://www.freesound.org/data/previews/259/259703_4486188-lq.mp3");
					beep.play();
				}

				client.toggleRec();
			}
		}

		client.registerOnRecEnd(function (transcript) {
			Helpers.handleDisplayRecording(transcript)
			client.sendMessage(transcript, {
				"browser": {
					"browser": BrowserDetect.browser,
					"version": BrowserDetect.version
				}
			});
			console.log("what you said was: ", transcript);
		})
	}

	// listen on form submit event and use handleCognigyMessage function
	const formElement = document.getElementById("cognigy-form");

	formElement && formElement.addEventListener("submit", function () {
		if (client && client.isConnected()) {
			const inputEl = document.getElementById("cognigy-input");
			const inputValue = inputEl && inputEl.textContent;
			if (inputEl) inputEl.textContent = "";

			client.sendMessage(inputValue, {
				"browser": {
					"browser": BrowserDetect.browser,
					"version": BrowserDetect.version
				}
			});
		}
	}, false);


	/* Add eventListener to messages from popups (fbextensions) */
	window.addEventListener("message", receiveMessage, false);

	/* If we receive a message event, display the message and send it to Cognigy */
	function receiveMessage(event) {
		// TODO: Improve security
		// This temparily fixes a bug caused by the Grammarly extension posting window events
		if (event && event.data && typeof event.data === "string" && event.data.match("setImmediate")) {
			return;
		}

		/* If the event is a postback, display the title instead of the payload. In this case, we use CustomEvent instead of MessageEvent for IE support */
		if (event && event.detail && event.detail.type === "postback") {
			Helpers.handleDisplayPostbackMessage(event.detail.title);
			handleCognigyMessage(event.detail.payload);

		} else if (event && event.data && event.origin === "https://fbextensions.cognigy.com") {
			Helpers.handleDisplayPostbackMessage(event.data);
			handleCognigyMessage(event.data);
		}
	}

	/* Handle file uploads. This requires that Cognigy sends us a file upload url in a data object */
	const uploadForm = document.getElementById('cognigy-file-upload-form');
	uploadForm && uploadForm.addEventListener("submit", function (e) {
		if (e)
			e.preventDefault()

		/* Check whether we have received a file upload url from Cognigy at some point */
		if (!fileUploadUrl) {
			console.error("Sorry, no file upload was specified. Cannot complete file upload");
			return;
		}

		const uploadInputEl = ((document.getElementById("cognigy-file-upload-input"): any): HTMLInputElement);
	var files = uploadInputEl.files;
	var data = new FormData();
	var fileNames = [];

	/* Loop through the files, append the files to FormData and print the file names in the chat */
	Array.prototype.map.call(files, function (file) {
		data.append("file", file, file.name);
		fileNames.push(file.name);
		Helpers.handleDisplayPostbackMessage(file.name);
	})

	var request = new XMLHttpRequest();

	/* Send message back to Cognigy when we get a response from the server */
	request.onreadystatechange = function () {
		// $FlowFixMe
		if (request.readyState === XMLHttpRequest['DONE'] && request.status === 200) {
			client.sendMessage("File upload completed", {
				event: "FileUpload",
				fileUpload: {
					fileNames: fileNames,
					statusCode: request.status,
					event: "fileUploadCompleted"
				},
				browser: {
					"browser": BrowserDetect.browser,
					"version": BrowserDetect.version
				}
			})
		} else if (request.status >= 400) {
			client.sendMessage(null, {
				event: "FileUploadError",
				fileUpload: {
					fileNames: fileNames,
					statusCode: request.status,
					event: "fileUploadError"
				},
				browser: {
					"browser": BrowserDetect.browser,
					"version": BrowserDetect.version
				}
			})
		}
	}

	request.open("POST", fileUploadUrl);
	request.send(data);
})

/* Call the 'exposeClientCallback' with the client if defined */
if (exposeClientCallback && typeof exposeClientCallback === "function") {
	exposeClientCallback(client);
}

return client;
}

const buildHTMLDocument = (options) => {
	/* Start by creating main div and inserting it in the body */
	const mainCognigyDiv = Helpers.createElement("div", "cognigy-web-chat", "cognigy");
	const body = document.getElementsByTagName("body")[0];
	body.appendChild(mainCognigyDiv);

	/* If there is a backgroundImage specified, then we load it */
	if (options.backgroundImageUrl) {
		body.style.backgroundImage = `url(${options.backgroundImageUrl})`;
	}

	//Function to create html elements
	var mainChatElement = document.getElementById("cognigy");
	var outerContainer = Helpers.createElement("div", "cognigy-outer-container__closed", "cognigy-outer-container");
	var toggleChatState = Helpers.createElement("div", "cognigy-chat-state-closed", "cognigy-toggle-state");
	if ((document: any).webchatColor) {
		toggleChatState.style.backgroundColor = (document: any).webchatColor;
	}
	toggleChatState.onclick = Helpers.handleChatOpen;
	mainChatElement && mainChatElement.appendChild(outerContainer);
	mainChatElement && mainChatElement.appendChild(toggleChatState);

	//Create standard header with text
	var headerContainer = Helpers.createElement("div", "cognigy-chat-header-container__open", "cognigy-header");
	if ((document: any).webchatColor) {
		headerContainer.style.backgroundColor = (document: any).webchatColor;
	}
	var header = Helpers.createElement("div", "cognigy-chat-header");

	//Create header title and subtitle
	var headerText = Helpers.createElement("div", "cognigy-header-text");
	var headerTitle = Helpers.createElement("span", "cognigy-header-title");
	var headerSubtitle = Helpers.createElement("span", "cognigy-header-subtitle");
	headerTitle.appendChild(document.createTextNode("Chat"));
	headerSubtitle.appendChild(document.createTextNode("Online"));
	headerText.appendChild(headerTitle);
	headerText.appendChild(headerSubtitle);

	//Create bot avatar with Cognigy logo and append to header
	var avatar = ((Helpers.createElement("img", "cognigy-header-avatar"): any): HTMLImageElement);
	avatar.src = "https://s3.eu-central-1.amazonaws.com/cognigydev/CognigyWebchat/images/cognigy_avatar.svg";
	avatar.id = "cognigyHeaderLogo";
	header.appendChild(avatar);

	// Close button for header on mobile
	var headerMobileClose = Helpers.createElement("div", "displayNone", "cognigy-toggle-state-mobile");
	headerMobileClose.onclick = Helpers.handleChatOpen;

	header.appendChild(headerText);
	header.appendChild(headerMobileClose);
	headerContainer.appendChild(header);
	outerContainer.appendChild(headerContainer);

	//Create chatContainer
	var chatContainer = Helpers.createElement("div", "cognigy-chat-container", "cognigy-container");
	outerContainer.appendChild(chatContainer);

	/* Render the getStartedButton */
	if (options.displayGetStartedButton) {
		const getStartedButton = Helpers.createElement("button", "cognigy-get-started-button", "cognigy-get-started-button");

		const getStartedButtonTitle = document.createTextNode(`${options.getStartedButtonText || "GET STARTED"}`);

		getStartedButton.appendChild(getStartedButtonTitle);
		outerContainer.appendChild(getStartedButton);
	}


	//Create chatForm with input, send button, record button and record toggle button
	var chatForm = Helpers.createElement("form", "displayNone", "cognigy-form");
	outerContainer.appendChild(chatForm);

	/* Check if the persistentMenu option is specified */
	if (options.enablePersistentMenu) {
		try {
			let persistentMenu;
			if (typeof options.persistentMenu === "string") {
				persistentMenu = JSON.parse(options.persistentMenu);
			} else {
				persistentMenu = options.persistentMenu;
			}

			render(
				// $FlowFixMe
				<PersistentMenu
					title={persistentMenu.title}
					menuItems={persistentMenu.menuItems}
				/>,
				chatForm
			);
		} catch (error) {
			console.log("There was an error loading the persistent menu. Error was:", error);
		}
	}

	var chatInput: any = Helpers.createElement("div", "cognigy-chat-input", "cognigy-input");

	chatInput.setAttribute("data-text", `${options.inputPlaceholder}`);

	chatInput.contentEditable = true;
	chatInput.returnKeyType = "Send";

	// Send message on enter and not on shift + enter
	//IE 11 polyfill for events
	(function () {

		if (typeof window.CustomEvent === "function") return false;

		function CustomEvent(event, params) {
			params = params || { bubbles: false, cancelable: false, detail: undefined };
			var evt = document.createEvent('CustomEvent');
			evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
			return evt;
		}

		CustomEvent.prototype = window.Event.prototype;

		window.CustomEvent = CustomEvent;
	})();

	var messageEvent = new CustomEvent('submit', { cancelable: true });
	chatInput.onkeydown = function (e) {
		e.keyCode === 13 && !e.shiftKey ? function () {
			if (e)
				e.preventDefault ? e.preventDefault() : (e.returnValue = false);
			const cognigyFormEl = document.getElementById('cognigy-form');
			cognigyFormEl && cognigyFormEl.dispatchEvent(messageEvent);
		}() : null;
	};
	chatForm.appendChild(chatInput);

	var chatButton = Helpers.createElement("button", "cognigy-chat-button", "cognigy-button");
	var sendAvatar = ((Helpers.createElement("img", "cognigy-send-icon"): any): HTMLImageElement);
	sendAvatar.src = "https://s3.eu-central-1.amazonaws.com/cognigydev/CognigyWebchat/images/send.svg";
	chatButton.appendChild(sendAvatar);
	chatForm.appendChild(chatButton);

	var recordToggleButton = ((Helpers.createElement("button", "cognigy-record-toggle-button", "cognigy-record-toggle"): any): HTMLButtonElement);

	recordToggleButton.type = "button";
	var recordToggleAvatar = ((Helpers.createElement("img", "displayNone"): any): HTMLImageElement);

	if (options && options.enableSTT) {
		recordToggleAvatar.className = "cognigy-record-toggle-icon";
		recordToggleButton.onclick = function () {
			handleRecordToggle();
		};
	}

	recordToggleAvatar.src = "https://s3.eu-central-1.amazonaws.com/cognigydev/CognigyWebchat/images/mic_on.svg";
	recordToggleButton.appendChild(recordToggleAvatar);
	chatForm.appendChild(recordToggleButton);

	var enableSTT = ((Helpers.createElement("button", "displayNone", "cognigy-record"): any): HTMLInputElement);
	enableSTT.type = "button";
	chatForm.insertBefore(enableSTT, recordToggleButton);

	/* This input will be hidden, so users see the button instead */
	var fileUploadInput = ((Helpers.createElement("input", "cognigy-file-upload-input", "cognigy-file-upload-input"): any): HTMLInputElement);
	fileUploadInput.type = "file";
	fileUploadInput.multiple = true;
	fileUploadInput.onchange = function () {
		const uploadFormEl = document.getElementById('cognigy-file-upload-form');
		uploadFormEl && uploadFormEl.dispatchEvent(messageEvent);
	}

	var fileUploadForm = ((Helpers.createElement("form", "displayNone", "cognigy-file-upload-form"): any): HTMLFormElement);
	fileUploadForm.enctype = "multipart/form-data"
	fileUploadForm.appendChild(fileUploadInput);

	chatForm.appendChild(fileUploadForm);

	var fileUploadButton = ((Helpers.createElement("button", "displayNone", "cognigy-file-upload-button"): any): HTMLButtonElement);

	fileUploadButton.type = "button";
	var fileUploadAvatar = ((Helpers.createElement("img", "cognigy-file-upload-icon"): any): HTMLImageElement);
	fileUploadAvatar.src = "https://s3.eu-central-1.amazonaws.com/cognigydev/CognigyWebchat/images/file_upload.svg";
	fileUploadButton.appendChild(fileUploadAvatar);
	chatForm.appendChild(fileUploadButton);

	if (options && options.enableFileUpload && options.enableSTT) {
		fileUploadForm.className = "cognigy-file-upload-form";
		fileUploadButton.className = "cognigy-file-upload-button";
	} else if (options && options.enableFileUpload && !options.enableSTT) {
		fileUploadForm.className = "cognigy-file-upload-form";
		fileUploadButton.className = "cognigy-file-upload-button-no-record-button";
		fileUploadInput.className = "cognigy-file-upload-input-no-record-button";
	}

	var recordToggled = false;
	function handleRecordToggle() {
		recordToggled = !recordToggled;

		if (recordToggled) {
			recordToggleAvatar.src = 'https://s3.eu-central-1.amazonaws.com/cognigydev/CognigyWebchat/images/mic_off.svg';
			//Change input to mic button
			chatInput.className = "displayNone";
			chatForm.style.justifyContent = "center";
			enableSTT.className = "cognigy-record-button";
		} else {
			//Change from mic button to text input
			recordToggleAvatar.src = "https://s3.eu-central-1.amazonaws.com/cognigydev/CognigyWebchat/images/mic_on.svg";
			enableSTT.className = "displayNone";
			chatInput.className = "cognigy-chat-input";
			chatForm.style.justifyContent = "space-between";
		}
	}


	//Add event listener for form submit event
	const formElement = document.getElementById("cognigy-form");
	formElement && formElement.addEventListener("submit", function (event) {
		if (event)
			// $FlowFixMe
			event.preventDefault ? event.preventDefault() : (event.returnValue = false);
		Helpers.handleSendMessage(event);
	}, false);
}

/** Convert an integer to a hex string */
function numberToString(number) {
	return ('0' + number.toString(16)).substr(-2)
}

function generateRandomId() {

	/* If window.crypto is available, we use this to create a new random id */
	if (window && window.crypto && window.crypto.getRandomValues) {
		const intArray = new Uint8Array(20);
		window.crypto.getRandomValues(intArray);

		return Array.from(intArray, (number) => numberToString(number)).join('');

	} else {
		/* Else we just use Date.now */
		return Date.now().toString();
	}
}

module.exports = {
	init
}