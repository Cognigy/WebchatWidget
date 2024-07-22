import React from "react";
import { IMessage } from "../../common/interfaces/message";
import Header from "./presentational/Header";
import { CacheProvider, ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";
import { IWebchatTheme, createWebchatTheme, getContrastColor } from "../style";
import WebchatRoot from "./presentational/WebchatRoot";
import { History } from "./history/History";
import createCache from "@emotion/cache";
import { isolate } from "../utils/css";
import { MessagePlugin } from "../../common/interfaces/message-plugin";
import FullScreenMessage from "./history/FullScreenMessage";
import Input from "./plugins/InputPluginRenderer";
import baseInputPlugin from "./plugins/input/base";
import { InputPlugin } from "../../common/interfaces/input-plugin";
import stylisRTL from "stylis-rtl";

import "../utils/normalize.css";
import { MessageSender } from "../interfaces";
import { ChatScroller } from "./history/ChatScroller";
import FAB from "./presentational/FAB";
import WebchatWrapper from "./presentational/WebchatWrapper";
import ChatIcon from "../assets/baseline-chat-24px.svg";
import CollapseIcon from "../assets/collapse-20px.svg";
import DisconnectOverlay from "./presentational/DisconnectOverlay";
import { IWebchatConfig } from "../../common/interfaces/webchat-config";
import { TTyping } from "../../common/interfaces/typing";
import Badge from "./presentational/Badge";
import getTextFromMessage from "../../webchat/helper/message";
import getKeyboardFocusableElements from "../utils/find-focusable";
import notificationSound from "../utils/notification-sound";
import { findReverse } from "../utils/find-reverse";
import "../../assets/style.css";
import TypingIndicator from "./history/TypingIndicator";
import {
	isDisabledOutOfBusinessHours,
	isHiddenOutOfBusinessHours,
	isInformingOutOfBusinessHours,
} from "../../webchat/helper/businessHours";
import {
	isDisabledDueToMaintenance,
	isHiddenDueToMaintenance,
	isInformingDueToMaintenance,
} from "../../webchat/helper/maintenance";
import FABDisabled from "./presentational/FABDisabled";
import {
	isDisabledDueToConnectivity,
	isHiddenDueToConnectivity,
	isInformingDueToConnectivity,
} from "../../webchat/helper/connectivity";
import { HomeScreen } from "./presentational/HomeScreen";
import { PrevConversationsList } from "./presentational/previous-conversations/ConversationsList";
import { PrevConversationsState } from "../../webchat/store/previous-conversations/previous-conversations-reducer";
import { ChatEvent, Message, Typography } from "@cognigy/chat-components";
import { isConversationEnded } from "./presentational/previous-conversations/helpers";
import { ISendMessageOptions } from "../../webchat/store/messages/message-middleware";
import { InformationMessage } from "./presentational/InformationMessage";
import { PrivacyNotice } from "./presentational/PrivacyNotice";
import { ChatOptions } from "./presentational/chat-options/ChatOptions";
import QueueUpdates from "./history/QueueUpdates";
import { UIState } from "../../webchat/store/ui/ui-reducer";
import DropZone from "./plugins/input/file/DropZone";
import { IFile } from "../../webchat/store/input/input-reducer";
import { CSSTransition } from "react-transition-group";
import { TeaserMessage } from "./presentational/TeaserMessage";
import XAppOverlay from "./functional/xapp-overlay/XAppOverlay";
import { getSourceBackgroundColor } from "../utils/sourceMapping";
import type { Options } from "@cognigy/socket-client/lib/interfaces/options";
import speechOutput from "./plugins/speech-output";
import getMessagesListWithoutPrivacyMessage from "../utils/filter-out-privacy-message";

export interface WebchatUIProps {
	currentSession: string;
	messages: IMessage[];
	unseenMessages: IMessage[];
	fullscreenMessage?: IMessage;
	onSetFullscreenMessage: (message: IMessage) => void;
	onDismissFullscreenMessage: () => void;

	onSendMessage: MessageSender;
	config: IWebchatConfig;
	typingIndicator: TTyping;

	open: boolean;

	messagePlugins?: MessagePlugin[];
	inputPlugins: InputPlugin[];

	inputMode: string;
	onSetInputMode: (inputMode: string) => void;
	onClose: () => void;
	onConnect: () => void;
	onToggle: () => void;
	onSetScrollToPosition: (position: number) => void;
	onSetLastScrolledPosition: (position: number | null) => void;
	scrollToPosition: number;
	lastScrolledPosition: number | null;

	onEmitAnalytics: (event: string, payload?: any) => void;
	onTriggerEngagementMessage: () => void;

	webchatRootProps?: React.ComponentProps<typeof WebchatRoot>;
	webchatToggleProps?: React.ComponentProps<typeof FAB>;

	connected: boolean;
	reconnectionLimit: boolean;

	hasGivenRating: boolean;
	showRatingScreen: boolean;
	onShowRatingScreen: (show: boolean) => void;
	onSetHasGivenRating: () => void;
	requestRatingScreenTitle: string;
	customRatingTitle: string;
	customRatingCommentText: string;
	requestRatingSubmitButtonText: string;
	requestRatingEventBannerText: string;
	requestRatingChatStatusBadgeText: string;

	showHomeScreen: boolean;
	onSetShowHomeScreen: (show: boolean) => void;

	sttActive: boolean;
	textActive: boolean;
	isDropZoneVisible: boolean;
	onSetDropZoneVisible: (isVisible: boolean) => void;
	fileList: IFile[];
	onSetFileList: (fileList: IFile[]) => void;
	fileUploadError: boolean;
	onSetFileUploadError: (hasError: boolean) => void;

	showPrevConversations: boolean;
	onSetShowPrevConversations: (show: boolean) => void;
	prevConversations: PrevConversationsState;
	onSwitchSession: (sessionId?: string, conversation?: PrevConversationsState[string]) => void;

	showChatOptionsScreen: boolean;
	onSetShowChatOptionsScreen: (show: boolean) => void;

	hasAcceptedTerms: boolean;
	onAcceptTerms: (userId: string) => void;
	onSetStoredMessage: (message: UIState["storedMessage"]) => void;
	isXAppOverlayOpen: boolean;
	openXAppOverlay: (message: string | undefined) => void;
	options?: Partial<Options>;
	ttsActive: boolean;
}

interface WebchatUIState {
	theme: IWebchatTheme;
	messagePlugins: MessagePlugin[];
	inputPlugins: InputPlugin[];
	/* Initially false, true from the point of first connection */
	hadConnection: boolean;
	lastUnseenMessageText: string;
	wasOpen: boolean;
	timedOut: boolean;
}

const stylisPlugins = [isolate("[data-cognigy-webchat-root]")];

/**
 * for RTL-layout websites, use the stylis-rtl plugin to convert CSS,
 * e.g. padding-left becomes padding-right etc.
 */
(() => {
	const dir = document.getElementsByTagName("html")[0].attributes["dir"];
	if (dir && dir.value === "rtl") {
		stylisPlugins.push(stylisRTL);
	}
})();

const styleCache = createCache({
	key: "cognigy-webchat",
	stylisPlugins,
});

const TopStatusMessage = styled(Typography)(({ theme }) => ({
	display: "block",
	textAlign: "center",
	padding: "12px",
	color: theme.black40
}));

const HistoryWrapper = styled(History)(({ theme }) => ({
	overflowY: "auto",
	flexGrow: 1,
	minHeight: 0,
	height: theme.blockSize,
}));

const RegularLayoutRoot = styled.div(() => ({
	position: "relative",
	height: "100%",
	display: "flex",
	flexDirection: "column",
}));

const RegularLayoutContentWrapper = styled.div(({ theme }) => ({
	height: "100%",
	zIndex: 3,
	display: "flex",
	flexDirection: "column",
	backgroundColor: theme.white,

	"&.slide-in-enter": {
		transform: "translateX(100%)",
	},
	"&.slide-in-enter-active": {
		transform: "translateX(0%)",
		transition: "transform 400ms ease-out",
	},
	"&.slide-in-exit": {
		transform: "translateX(0%)",
	},
	"&.slide-in-exit-active": {
		transform: "translateX(100%)",
		transition: "transform 400ms ease-out",
	},

	"&.slide-in-enter:dir(rtl)": {
		transform: "translateX(-100%)",
	},
	"&.slide-in-enter-active:dir(rtl)": {
		transform: "translateX(0%)",
		transition: "transform 400ms ease-out",
	},
	"&.slide-in-exit:dir(rtl)": {
		transform: "translateX(0%)",
	},
	"&.slide-in-exit-active:dir(rtl)": {
		transform: "translateX(-100%)",
		transition: "transform 400ms ease-out",
	},
}));

export class WebchatUI extends React.PureComponent<
	React.HTMLProps<HTMLDivElement> & WebchatUIProps,
	WebchatUIState
> {
	state = {
		theme: createWebchatTheme(),
		messagePlugins: [],
		inputPlugins: [],
		hadConnection: false,
		lastUnseenMessageText: "",
		wasOpen: false,
		timedOut: false,
	};

	history: React.RefObject<ChatScroller>;
	chatToggleButtonRef: React.RefObject<HTMLButtonElement>;
	closeButtonInHeaderRef: React.RefObject<HTMLButtonElement>;
	menuButtonInHeaderRef: React.RefObject<HTMLButtonElement>;
	ratingButtonInHeaderRef: React.RefObject<HTMLButtonElement>;
	webchatWindowRef: React.RefObject<HTMLDivElement>;
	homeScreenCloseButtonRef: React.RefObject<HTMLButtonElement>;

	private unreadTitleIndicatorInterval: ReturnType<typeof setInterval> | null = null;
	private originalTitle: string = window.document.title;
	private titleType: "original" | "unread" = "original";
	private hideNotifications = true;
	private visibilityCheckInitialized = false;
	private visibilityCheckCompleted = false;

	private engagementMessageTimeout: ReturnType<typeof setTimeout> | null = null;

	constructor(props) {
		super(props);
		this.history = React.createRef();
		this.chatToggleButtonRef = React.createRef();
		this.closeButtonInHeaderRef = React.createRef();
		this.menuButtonInHeaderRef = React.createRef();
		this.ratingButtonInHeaderRef = React.createRef();
		this.webchatWindowRef = React.createRef();
		this.homeScreenCloseButtonRef = React.createRef();

		this.handleStartConversation = this.handleStartConversation.bind(this);
	}

	static getDerivedStateFromProps(
		props: WebchatUIProps,
		state: WebchatUIState,
	): WebchatUIState | null {
		const primaryColor = props?.config?.settings?.colors?.primaryColor;
		const secondaryColor = props?.config?.settings?.colors?.secondaryColor;
		const chatInterfaceColor = props?.config?.settings?.colors?.chatInterfaceColor;
		const sourceColorMapping = props?.config?.settings?.widgetSettings?.sourceColorMapping;

		const overrideBotMessageColor = getSourceBackgroundColor(sourceColorMapping?.bot, props?.config?.settings?.colors);
		const overrideUserMessageColor = getSourceBackgroundColor(sourceColorMapping?.user, props?.config?.settings?.colors);
		const overrideAgentMessageColor = getSourceBackgroundColor(sourceColorMapping?.agent, props?.config?.settings?.colors);

		const overrideBotMessageBorderColor = sourceColorMapping?.bot === "user" ? "transparent" : null;
		const overrideUserMessageBorderColor = sourceColorMapping?.user === "bot" ? state.theme.black80 : null;
		const overrideAgentMessageBorderColor = sourceColorMapping?.agent === "user" ? "transparent" : null;

		const botMessageColor = overrideBotMessageColor || props?.config?.settings?.colors?.botMessageColor;		
		const userMessageColor = overrideUserMessageColor || props?.config?.settings?.colors?.userMessageColor;

		const textLinkColor = props?.config?.settings?.colors?.textLinkColor;

		let isThemeChanged = false;

		if (!!primaryColor && primaryColor !== state.theme.primaryColor) {
			// We will integrate this into the theme object in the future
			// This is a demo of injecting a custom color scheme
			document.documentElement.style.setProperty("--webchat-primary-color", primaryColor);
			// This is example of how a new theme properties can be added
			// document.documentElement.style.setProperty('--webchat-background-bot-message', color);

			const primaryContrastColor = getContrastColor(primaryColor);
			document.documentElement.style.setProperty("--webchat-primary-contrast-color", primaryContrastColor);

			isThemeChanged = true;
		}

		if (!!secondaryColor && secondaryColor !== state.theme.secondaryColor) {
			document.documentElement.style.setProperty("--webchat-secondary-color", secondaryColor);

			const secondaryContrastColor = getContrastColor(secondaryColor);
			document.documentElement.style.setProperty("--webchat-secondary-contrast-color", secondaryContrastColor);

			isThemeChanged = true;
		}
		if (!!chatInterfaceColor && chatInterfaceColor !== state.theme.backgroundWebchat) {
			document.documentElement.style.setProperty(
				"--webchat-background-webchat",
				chatInterfaceColor,
			);
			isThemeChanged = true;
		}
		if (!!botMessageColor && botMessageColor !== state.theme.backgroundBotMessage) {
			document.documentElement.style.setProperty(
				"--webchat-background-bot-message",
				botMessageColor,
			);
			const botMessageContrastColor = getContrastColor(botMessageColor);
			document.documentElement.style.setProperty("--webchat-bot-message-contrast-color", botMessageContrastColor);
			isThemeChanged = true;
		}
		if (!!userMessageColor && userMessageColor !== state.theme.backgroundUserMessage) {
			document.documentElement.style.setProperty(
				"--webchat-background-user-message",
				userMessageColor,
			);
			const userMessageContrastColor = getContrastColor(userMessageColor);
			document.documentElement.style.setProperty("--webchat-user-message-contrast-color", userMessageContrastColor);
			isThemeChanged = true;
		}
		if (overrideAgentMessageColor) {
			document.documentElement.style.setProperty("--webchat-background-agent-message", overrideAgentMessageColor);
			const agentMessageContrastColor = getContrastColor(overrideAgentMessageColor);
			document.documentElement.style.setProperty("--webchat-agent-message-contrast-color", agentMessageContrastColor);
		}
		if (overrideBotMessageBorderColor) {
			document.documentElement.style.setProperty("--webchat-border-bot-message", overrideBotMessageBorderColor);
		}
		if (overrideUserMessageBorderColor) {
			document.documentElement.style.setProperty("--webchat-border-user-message", overrideUserMessageBorderColor);
		}
		if (overrideAgentMessageBorderColor) {
			document.documentElement.style.setProperty("--webchat-border-agent-message", overrideAgentMessageBorderColor);
		}
		if (!!textLinkColor && textLinkColor !== state.theme.textLink) {
			document.documentElement.style.setProperty("--webchat-text-link", textLinkColor);
			isThemeChanged = true;
		}

		if (isThemeChanged)
			return {
				...state,
				theme: createWebchatTheme({
					primaryColor,
					secondaryColor,
					backgroundWebchat: chatInterfaceColor,
					backgroundBotMessage: botMessageColor,
					backgroundUserMessage: userMessageColor,
					textLink: textLinkColor,
				}),
			};

		return null;
	}

	private checkNotificationsHidden = async () => {
		let timeoutReached = false;
		if (
			this.props.config.settings.embeddingConfiguration.awaitEndpointConfig &&
			!this.props.config.isConfigLoaded
		) {
			const timeout =
				(this.props.config.settings.embeddingConfiguration?.connectivity?.enabled &&
					this.props.config.settings.embeddingConfiguration?.connectivity?.timeout) ||
				1000;
			let timeoutCounter = 0;
			while (!this.props.config.isConfigLoaded && !timeoutReached) {
				await new Promise(f => setTimeout(f, 50));
				timeoutCounter += 50;
				if (timeoutCounter >= timeout) {
					timeoutReached = true;
					this.setState({
						timedOut: true,
					});
				}
			}
		}
		this.hideNotifications =
			isDisabledDueToConnectivity(this.props.config.settings, timeoutReached) ||
			isDisabledDueToMaintenance(this.props.config.settings) ||
			isDisabledOutOfBusinessHours(this.props.config.settings.businessHours) ||
			isInformingDueToConnectivity(this.props.config.settings, timeoutReached) ||
			isInformingDueToMaintenance(this.props.config.settings) ||
			isInformingOutOfBusinessHours(this.props.config.settings.businessHours) ||
			isHiddenDueToConnectivity(this.props.config.settings, timeoutReached) ||
			isHiddenDueToMaintenance(this.props.config.settings) ||
			isHiddenOutOfBusinessHours(this.props.config.settings.businessHours) ||
			false;
	};

	componentDidMount() {
		const defaultMessagePlugins: MessagePlugin[] = [];
		if (this.props.ttsActive) {
			defaultMessagePlugins.push(speechOutput);
		}
		this.setState({
			inputPlugins: [...(this.props.inputPlugins || []), baseInputPlugin],
			messagePlugins: [...(this.props.messagePlugins || []), ...defaultMessagePlugins]
		});
	}

	async componentDidUpdate(prevProps: WebchatUIProps, prevState: WebchatUIState) {

		if (prevProps.ttsActive !== this.props.ttsActive ||
			prevProps.inputPlugins !== this.props.inputPlugins ||
			prevProps.messagePlugins !== this.props.messagePlugins) {
			
			const defaultMessagePlugins: MessagePlugin[] = [];
			if (this.props.ttsActive) {
				defaultMessagePlugins.push(speechOutput);
			}

			
			this.setState({
				inputPlugins: [...(this.props.inputPlugins || []), baseInputPlugin],
				messagePlugins: [...(this.props.messagePlugins || []), ...defaultMessagePlugins]
			});
		}

		if (
			this?.props?.config?.settings?.colors?.primaryColor !==
				prevProps?.config?.settings?.colors?.primaryColor ||
			this?.props?.config?.settings?.colors?.secondaryColor !==
				prevProps?.config?.settings?.colors?.secondaryColor ||
			this?.props?.config?.settings?.colors?.chatInterfaceColor !==
				prevProps?.config?.settings?.colors?.chatInterfaceColor ||
			this?.props?.config?.settings?.colors?.botMessageColor !==
				prevProps?.config?.settings?.colors?.botMessageColor ||
			this?.props?.config?.settings?.colors?.userMessageColor !==
				prevProps?.config?.settings?.colors?.userMessageColor ||
			this?.props?.config?.settings?.colors?.textLinkColor !==
				prevProps?.config?.settings?.colors?.textLinkColor
		) {
			this.setState({
				theme: createWebchatTheme({
					primaryColor: this?.props?.config?.settings?.colors?.primaryColor,
					secondaryColor: this?.props?.config?.settings?.colors?.secondaryColor,
					backgroundWebchat: this?.props?.config?.settings?.colors?.chatInterfaceColor,
					backgroundBotMessage: this?.props?.config?.settings?.colors?.botMessageColor,
					backgroundUserMessage: this?.props?.config?.settings?.colors?.userMessageColor,
					textLink: this?.props?.config?.settings?.colors?.textLinkColor,
				}),
			});
		}

		if (!prevState.hadConnection && this.props.connected) {
			this.setState({
				hadConnection: true,
			});
		}

		if (!this.visibilityCheckInitialized) {
			this.visibilityCheckInitialized = true;
			await this.checkNotificationsHidden();
			this.visibilityCheckCompleted = true;
		}

		while (!this.visibilityCheckCompleted) {
			await new Promise(f => setTimeout(f, 50));
		}

		if (
			(!this.hideNotifications && prevProps.unseenMessages !== this.props.unseenMessages) ||
			(!prevProps.config.settings.unreadMessages.enablePreview &&
				this.props.config.settings.unreadMessages.enablePreview)
		) {
			const { unseenMessages } = this.props;

			// update the "unseen message preview" text
			if (
				this.props.config.settings.unreadMessages.enablePreview ||
				(!this.state.wasOpen && this.props.config.settings.teaserMessage.text)
			) {
				let lastUnseenMessageText = "";

				// find the last readable message and remember its text
				const lastReadableUnseenMessage = findReverse(
					this.props.unseenMessages,
					message => !!getTextFromMessage(message),
				);
				if (lastReadableUnseenMessage) {
					lastUnseenMessageText = getTextFromMessage(lastReadableUnseenMessage);
				}

				this.setState({
					lastUnseenMessageText,
				});
			}

			// play a notification for unread messages
			if (
				unseenMessages.length > 0 &&
				this.props.config.settings.unreadMessages.enableSound
			) {
				notificationSound.play();
			}
		}

		if (
			prevProps.config.settings.unreadMessages.enablePreview &&
			!this.props.config.settings.unreadMessages.enablePreview
		) {
			this.setState({ lastUnseenMessageText: "" });
		}

		if (!this.hideNotifications) {
			// initialize the title indicator if configured
			if (this.props.config.settings.unreadMessages.enableIndicator) {
				this.initializeTitleIndicator();
			}

			// initialize the engagement message if configured
			this.initializeEngagementMessage();

			if (this.props.open && !this.state.wasOpen) {
				this.setState({
					wasOpen: true,
				});
			}
		}
	}

	componentWillUnmount() {
		/**
		 * this tears down the "unread messages" title indicator
		 */
		if (this.unreadTitleIndicatorInterval) {
			clearInterval(this.unreadTitleIndicatorInterval);
			this.unreadTitleIndicatorInterval = null;
		}

		/**
		 * this tears down the timeout for an "engagement message"
		 */
		if (this.engagementMessageTimeout) {
			clearTimeout(this.engagementMessageTimeout);
			this.engagementMessageTimeout = null;
		}
	}

	/**
	 * This triggers the engagement message in case the webchat
	 * was not yet open and the history is empty
	 */
	triggerEngagementMessage = () => {
		if (this.state.wasOpen || this.props.messages.length > 0) return;

		this.props.onTriggerEngagementMessage();
	};

	/**
	 * This sets up the "engagement message" timeout.
	 * It should only be registered once
	 */
	initializeEngagementMessage = () => {
		if (this.engagementMessageTimeout) return;

		if (
			this.props.config.settings.teaserMessage.text &&
			typeof this.props.config.settings.teaserMessage.teaserMessageDelay === "number" &&
			this.props.config.settings.teaserMessage.teaserMessageDelay >= 0
		) {
			this.engagementMessageTimeout = setTimeout(
				this.triggerEngagementMessage,
				this.props.config.settings.teaserMessage.teaserMessageDelay,
			);
		}
	};

	/**
	 * This sets up the "unread messages" title indicator interval.
	 * It should only be registered once!
	 */
	initializeTitleIndicator = async () => {
		if (this.unreadTitleIndicatorInterval || this.hideNotifications) return;

		this.unreadTitleIndicatorInterval = setInterval(this.toggleTitleIndicator, 1000);
	};

	toggleTitleIndicator = () => {
		if (this.titleType === "unread") {
			document.title = this.originalTitle;
			this.titleType = "original";
		} else {
			if (this.props.unseenMessages.length > 0) {
				document.title = `(${this.props.unseenMessages.length}) ${
					this.props.unseenMessages.length === 1
						? this.props.config.settings.unreadMessages.unreadMessageTitleText
						: this.props.config.settings.unreadMessages.unreadMessageTitleTextPlural
				}`;
				this.titleType = "unread";
			}
		}
	};

	sendMessage: MessageSender = (...args) => {
		if (this.history.current) {
			this.history.current.handleScrollTo(undefined, true);
		}

		this.props.onSendMessage(...args);

		// we activate scrollToPosition functionality on first message
		if (this.props.lastScrolledPosition === null) {
			this.props.onSetLastScrolledPosition(0);
		}
	};

	renderInput = () => {
		const { inputPlugins } = this.state;
		const { messages } = this.props;
		if (isConversationEnded(messages)) return null;

		return (
			<Input
				plugins={inputPlugins}
				messages={this.props.messages}
				onSendMessage={this.sendMessage}
				config={this.props.config}
				onSetInputMode={this.props.onSetInputMode}
				inputMode={this.props.inputMode}
				webchatTheme={this.state.theme}
				onEmitAnalytics={this.props.onEmitAnalytics}
				theme={this.state.theme}
				sttActive={this.props.sttActive}
				textActive={this.props.textActive}
			/>
		);
	};

	// Key down handler
	handleKeydown = event => {
		const { enableFocusTrap } = this.props.config.settings.widgetSettings;
		const { open } = this.props;
		const { target, key, shiftKey } = event;
		const shiftTabKeyPress = shiftKey && key === "Tab";
		const tabKeyPress = !shiftKey && key === "Tab";

		if (enableFocusTrap && open) {
			// Get the first and last focusable elements within the webchat window and add focus
			const webchatWindowEl = this.webchatWindowRef?.current as HTMLElement;
			const { firstFocusable, lastFocusable } = getKeyboardFocusableElements(webchatWindowEl);
			const chatToggleButton = this.chatToggleButtonRef?.current;

			/**
			 * In order to trap focus,
			 *
			 * on Shift + Tab navigation, move the focus from first focusable element (located at the top-left of webchat)
			 * or from the chat toggle, to the last focusable element (located at the bottom-right of webchat).
			 *
			 * On Tab navigation, the focus should move from the last focusable element or from the chat toggle to the
			 * first focusable element within the chat window.
			 *
			 */

			if ((target === chatToggleButton || target === firstFocusable) && shiftTabKeyPress) {
				event.preventDefault();
				// Focus the last focusable element
				lastFocusable?.focus();
			} else if ((target === chatToggleButton || target === lastFocusable) && tabKeyPress) {
				event.preventDefault();
				// Focus the first focusable element
				setTimeout(() => {
					firstFocusable?.focus();
				}, 0);
			}
		}
	};

	handleSendRating = ({ rating, comment, showRatingStatus }) => {
		this.props.onShowRatingScreen(false);

		if (this.history.current) {
			this.history.current.handleScrollTo();
		}

		this.props.onSendMessage(
			undefined,
			{
				_cognigy: {
					controlCommands: [
						{
							type: "setRating",
							parameters: {
								rating,
								comment,
								showRatingStatus,
							},
						},
					],
				},
			},
			undefined,
		);

		this.props.onSetHasGivenRating();
	};

	handleSendActionButtonMessage = (
		text?: string,
		data?: any,
		options?: Partial<ISendMessageOptions>,
	) => {
		this.props.onSetShowHomeScreen(false);
		this.props.onSetShowChatOptionsScreen(false);

		if (this.props.config.settings.privacyNotice.enabled && !this.props.hasAcceptedTerms) {
			this.props.onSetStoredMessage({
				text,
				data,
				options,
			});
		} else {
			this.props.onSendMessage(text, data, options);
		}
	};

	handleStartConversation = () => {
		if (!this.props.config.settings.privacyNotice.enabled || this.props.hasAcceptedTerms) {
			const { initialSessionId } = this.props.config;
			if (!initialSessionId) {
				this.props.onSwitchSession();
			}
			if (initialSessionId && initialSessionId !== this.props.currentSession) {
				this.props.onSwitchSession(initialSessionId);
			}
		}

		if (!this.props.open) this.props.onToggle();
		this.props.onSetShowHomeScreen(false);
		this.props.onSetShowChatOptionsScreen(false);
	};

	openConversationFromTeaser = () => {
		// in this case we always open to current session
		this.props.onToggle();
		this.props.onSetShowHomeScreen(false);
		this.props.onSetShowChatOptionsScreen(false);
	};

	render() {
		const { props, state } = this;
		const {
			messages,
			unseenMessages,
			prevConversations,
			onSendMessage,
			onConnect,
			config,
			open,
			fullscreenMessage,
			typingIndicator,
			onEmitAnalytics,
			onSetInputMode,
			onSetFullscreenMessage,
			onDismissFullscreenMessage,
			onClose,
			onToggle,
			onSetScrollToPosition,
			onSetLastScrolledPosition,
			scrollToPosition,
			lastScrolledPosition,
			onTriggerEngagementMessage,
			webchatRootProps,
			webchatToggleProps,
			connected,
			reconnectionLimit,
			showRatingScreen,
			onShowRatingScreen,
			onSetShowHomeScreen,
			onSetHasGivenRating,
			onSetShowPrevConversations,
			onSetShowChatOptionsScreen,
			onSwitchSession,
			requestRatingScreenTitle,
			customRatingTitle,
			customRatingCommentText,
			requestRatingSubmitButtonText,
			requestRatingEventBannerText,
			requestRatingChatStatusBadgeText,
			onAcceptTerms,
			onSetStoredMessage,
			onSetFileList,
			onSetFileUploadError,
			onSetDropZoneVisible,
			isXAppOverlayOpen,
			openXAppOverlay,
			...restProps
		} = props;
		const { theme, hadConnection, lastUnseenMessageText, wasOpen } = state;

		const {
			widgetSettings: { disableToggleButton },
			behavior: { enableConnectionStatusIndicator },
		} = config.settings;

		if (
			(!config.active && !config.settings.embeddingConfiguration.connectivity.enabled) ||
			(!config.isConfigLoaded &&
				config.settings.embeddingConfiguration.awaitEndpointConfig) ||
			(config.isConfigLoaded &&
				config.settings.embeddingConfiguration.awaitEndpointConfig &&
				(isHiddenOutOfBusinessHours(config.settings.businessHours) ||
					isHiddenDueToMaintenance(config.settings) ||
					isHiddenDueToConnectivity(config.settings, state.timedOut)))
		)
			return null;

		const isDisabled =
			config.isConfigLoaded &&
			config.settings.embeddingConfiguration.awaitEndpointConfig &&
			(isDisabledDueToMaintenance(config.settings) ||
				isDisabledOutOfBusinessHours(config.settings.businessHours) ||
				isDisabledDueToConnectivity(config.settings, state.timedOut));

		const isInforming =
			config.isConfigLoaded &&
			config.settings.embeddingConfiguration.awaitEndpointConfig &&
			(isInformingDueToMaintenance(config.settings) ||
				isInformingOutOfBusinessHours(config.settings.businessHours) ||
				isInformingDueToConnectivity(config.settings, state.timedOut));

		const showDisconnectOverlay =
			enableConnectionStatusIndicator && !connected && hadConnection;

		const openChatAriaLabel = () => {
			switch (unseenMessages.length) {
				case 0:
					return "Open chat";
				case 1:
					return "One unread message in chat. Open chat";
				default:
					return `${unseenMessages.length} unread messages in chat. Open chat`;
			}
		};

		const getDisabledMessage = () => {
			if (isDisabled && isDisabledDueToMaintenance(this.props.config.settings)) {
				return (
					this.props.config.settings.maintenance.text ||
					"This chat is currently disabled due to maintenance"
				);
			} else if (
				isDisabled &&
				isDisabledOutOfBusinessHours(this.props.config.settings.businessHours)
			) {
				return (
					this.props.config.settings.maintenance.text ||
					"This chat is disabled out of our business hours"
				);
			} else if (
				isDisabled &&
				isDisabledDueToConnectivity(this.props.config.settings, this.state.timedOut)
			) {
				return (
					this.props.config.settings.embeddingConfiguration.connectivity.text ||
					"This chat is disabled due to connectivity issues"
				);
			}
		};

		const onHideTeaserMessage = () => {
			this.setState({
				lastUnseenMessageText: "",
			});
			// Restore focus to chat toggle button
			this.chatToggleButtonRef.current?.focus();
		};

		return (
			<>
				<ThemeProvider theme={theme}>
					{/* <Global styles={cssReset} /> */}
					<>
						<WebchatWrapper
							data-cognigy-webchat-root
							{...restProps}
							className="webchat-root"
							aria-labelledby="webchatHeaderTitle"
							role="region"
							onKeyDown={this.handleKeydown}
						>
							<CacheProvider value={styleCache}>
								{open &&
									(!this.props.config.settings.embeddingConfiguration
										.awaitEndpointConfig ||
										(this.props.config.settings.embeddingConfiguration
											.awaitEndpointConfig &&
											this.props.config.isConfigLoaded)) && (
										<WebchatRoot
											data-cognigy-webchat
											{...webchatRootProps}
											className="webchat"
											id="webchatWindow"
											ref={this.webchatWindowRef}
										>
											{!fullscreenMessage
												? this.renderRegularLayout(isInforming)
												: this.renderFullscreenMessageLayout()}
											{showDisconnectOverlay && (
												<DisconnectOverlay
													onConnect={onConnect}
													isPermanent={!!reconnectionLimit}
													onClose={onClose}
												/>
											)}
										</WebchatRoot>
									)}
								{!disableToggleButton && (
									<div>
										{
											// Show the message teaser if there is a last bot message and the webchat is closed
											lastUnseenMessageText && (
												<TeaserMessage
													messageText={lastUnseenMessageText}
													onClick={this.openConversationFromTeaser}
													config={config}
													onEmitAnalytics={onEmitAnalytics}
													onSendActionButtonMessage={
														this.handleSendActionButtonMessage
													}
													onHideTeaserMessage={onHideTeaserMessage}
													wasOpen={wasOpen}
												/>
											)
										}
										{isDisabled ? (
											<div
												title={getDisabledMessage()}
												tabIndex={-1}
												aria-disabled
											>
												<FABDisabled
													data-cognigy-webchat-toggle
													{...webchatToggleProps}
													type="button"
													className="webchat-toggle-button-disabled"
													aria-label={getDisabledMessage()}
													ref={this.chatToggleButtonRef}
													disabled
												>
													<ChatIcon />
												</FABDisabled>
											</div>
										) : (
											<FAB
												data-cognigy-webchat-toggle
												onClick={onToggle}
												{...webchatToggleProps}
												type="button"
												className="webchat-toggle-button"
												aria-label={
													open ? "Close chat" : openChatAriaLabel()
												}
												ref={this.chatToggleButtonRef}
											>
												{open ? <CollapseIcon /> : <ChatIcon />}
												{config.settings.unreadMessages.enableBadge ? (
													<Badge
														_content={unseenMessages.length}
														className="webchat-unread-message-badge"
														aria-label={`${unseenMessages.length} unread messages`}
													/>
												) : null}
											</FAB>
										)}
									</div>
								)}
							</CacheProvider>
						</WebchatWrapper>
					</>
				</ThemeProvider>
			</>
		);
	}

	renderRegularLayout(isInforming: boolean) {
		const {
			currentSession,
			config,
			messages,
			scrollToPosition,
			lastScrolledPosition,
			onSetScrollToPosition,
			onSetLastScrolledPosition,
			showHomeScreen,
			onSetShowHomeScreen,
			showPrevConversations,
			onSetShowPrevConversations,
			showChatOptionsScreen,
			onSetShowChatOptionsScreen,
			requestRatingScreenTitle,
			customRatingTitle,
			customRatingCommentText,
			requestRatingSubmitButtonText,
			requestRatingEventBannerText,
			showRatingScreen,
			onShowRatingScreen,
			onSwitchSession,
			onClose,
			onEmitAnalytics,
			onSendMessage,
			hasAcceptedTerms,
			onAcceptTerms,
			onSetStoredMessage,
			isDropZoneVisible,
			isXAppOverlayOpen,
		} = this.props;

		let informMessage = "";
		let informTitle = "";
		if (config.settings.maintenance.enabled && config.settings.maintenance.mode === "inform") {
			informMessage =
				config.settings.maintenance.text || "This Webchat is disabled due to maintenance";
			informTitle = config.settings.maintenance.title || "";
		} else if (
			config.settings.embeddingConfiguration.connectivity.enabled &&
			config.settings.embeddingConfiguration.connectivity.mode === "inform"
		) {
			informMessage =
				config.settings.embeddingConfiguration.connectivity.text ||
				"This Webchat is disabled due to connectivity issues";
			informTitle = config.settings.embeddingConfiguration.connectivity.title || "";
		} else if (
			config.settings.businessHours.enabled &&
			config.settings.businessHours.mode === "inform"
		) {
			informMessage =
				config.settings.businessHours.text ||
				"This Webchat is disabled out of business hours";
			informTitle = config.settings.businessHours.title || "";
		}

		const showInformationMessage = isInforming && informMessage;

		// TODO: implement better navigation history and currentPage string property on redux
		const isSecondaryView = showInformationMessage;

		const handleOnClose = () => {
			onClose?.();
			// Restore focus to chat toggle button
			this.chatToggleButtonRef?.current?.focus?.();
		};

		const handleCloseAndReset = () => {
			onSwitchSession();
			onSetShowHomeScreen(true);
			onClose();
			// Restore focus to chat toggle button
			this.chatToggleButtonRef?.current?.focus?.();
		}

		// TODO implement proper navigation solution
		const handleOnGoBack = () => {
			if (!showChatOptionsScreen && !showRatingScreen) {
				onSetShowPrevConversations(false);
				onSetShowHomeScreen(true);
				// Set timeout to focus on close button in header of home screen after animation
				setTimeout(() => {
					this.homeScreenCloseButtonRef?.current?.focus?.();
				}, 450);
			} else {
				onSetShowChatOptionsScreen(false);
				onShowRatingScreen(false);
				if (config.settings.widgetSettings.disableInputAutofocus) {
					// Restore focus to close button in header
					this.closeButtonInHeaderRef?.current?.focus?.();
				}
			}
		};

		const handleAcceptTerms = () => {
			onAcceptTerms(this.props?.options?.userId || "");

			const data = {
				_cognigy: {
					controlCommands: [{ type: "acceptPrivacyPolicy" }],
				},
			};

			this.props.onSendMessage("", data);
		};

		const handleDragEnter = e => {
			e.preventDefault();
			e.stopPropagation();

			this.props.onSetDropZoneVisible(true);
		};

		const handleDropZoneVisibility = (isDropZoneVisible: boolean) => {
			this.props.onSetDropZoneVisible(isDropZoneVisible);
		};

		const getRegularLayoutContent = () => {
			if (showInformationMessage) return <InformationMessage message={informMessage} />;

			if (!hasAcceptedTerms && config.settings.privacyNotice.enabled)
				return (
					<PrivacyNotice
						privacyNotice={config.settings.privacyNotice}
						onAcceptTerms={handleAcceptTerms}
					/>
				);

			if (isXAppOverlayOpen) return <XAppOverlay />;

			if (showPrevConversations)
				return (
					<PrevConversationsList
						conversations={this.props.prevConversations}
						onSetShowPrevConversations={onSetShowPrevConversations}
						onSwitchSession={onSwitchSession}
						config={config}
					/>
				);

			if (showChatOptionsScreen || showRatingScreen)
				return (
					<ChatOptions
						config={config}
						ratingTitleText={
							customRatingTitle || config.settings.chatOptions.rating.title
						}
						ratingCommentText={
							customRatingCommentText ||
							config.settings.chatOptions.rating.commentPlaceholder
						}
						ratingSubmitButtonText={
							requestRatingSubmitButtonText ||
							config.settings.chatOptions.rating.submitButtonText
						}
						ratingEventBannerText={
							requestRatingEventBannerText ||
							config.settings.chatOptions.rating.eventBannerText
						}
						showOnlyRating={showRatingScreen}
						hasGivenRating={this.props.hasGivenRating}
						onSendRating={this.handleSendRating}
						onEmitAnalytics={onEmitAnalytics}
						onSendActionButtonMessage={this.handleSendActionButtonMessage}
					/>
				);

			if (isDropZoneVisible)
				return (
					<DropZone
						layoutSettings={config.settings.layout}
						dropzoneText={config.settings.fileStorageSettings?.dropzoneText}
					/>
				);

			return (
				<>
					<HistoryWrapper
						scrollToPosition={scrollToPosition}
						setScrollToPosition={onSetScrollToPosition}
						lastScrolledPosition={lastScrolledPosition}
						setLastScrolledPosition={onSetLastScrolledPosition}
						ref={this.history as any}
						className="webchat-chat-history"
						tabIndex={messages?.length === 0 ? -1 : 0} // When no messages, remove chat history from tab order
						onDragEnter={handleDragEnter}
					>
						<h2 className="sr-only" id="webchatChatHistoryHeading">
							Chat History
						</h2>
						{this.renderHistory()}
					</HistoryWrapper>
					<QueueUpdates handleScroll={this.history.current?.handleScrollTo} />
					{this.renderInput()}
				</>
			);
		};

		const getTitles = () => {
			if (showInformationMessage && informTitle) {
				return informTitle;
			}
			if (!hasAcceptedTerms && config.settings.privacyNotice.enabled) {
				return config.settings.privacyNotice.title || "Privacy notice";
			}
			if (showPrevConversations) {
				return (
					config.settings.homeScreen.previousConversations.title ||
					"Previous conversations"
				);
			}
			if (showChatOptionsScreen) {
				return config.settings.chatOptions.title || "Chat options";
			}
			if (showRatingScreen) {
				return requestRatingScreenTitle || "Conversation rating";
			}
			if (config.settings.layout.title) {
				return config.settings.layout.title;
			}
			return "Cognigy";
		};

		const isHomeScreenEnabled = config.settings.homeScreen.enabled;
		const showEnabledHomeScreen = isHomeScreenEnabled && showHomeScreen;

		const showChatScreen =
			!showChatOptionsScreen &&
			!showRatingScreen &&
			!showPrevConversations &&
			!showEnabledHomeScreen &&
			!showInformationMessage &&
			(hasAcceptedTerms || !config.settings.privacyNotice.enabled);

		const isChatOptionsButtonVisible = config.settings.chatOptions.enabled && showChatScreen;

		const hideBackButton = showChatScreen && !isHomeScreenEnabled;

		return (
			<RegularLayoutRoot>
				{!isXAppOverlayOpen && (
					<CSSTransition
						in={!!(!showEnabledHomeScreen || showInformationMessage)}
						timeout={500}
						classNames="slide-in"
						mountOnEnter
						unmountOnExit
					>
						{!isXAppOverlayOpen && (
							<Header
								onClose={handleCloseAndReset}
								onMinimize={handleOnClose}
								onGoBack={showInformationMessage ? undefined : handleOnGoBack}
								onSetShowChatOptionsScreen={onSetShowChatOptionsScreen}
								isChatOptionsButtonVisible={isChatOptionsButtonVisible}
								logoUrl={
									!showChatOptionsScreen && !showRatingScreen
										? config.settings.layout.logoUrl
										: undefined
								}
								title={getTitles()}
								closeButtonRef={this.closeButtonInHeaderRef}
								menuButtonRef={this.menuButtonInHeaderRef}
								chatToggleButtonRef={this.chatToggleButtonRef}
								hideBackButton={hideBackButton}
								showChatScreen={showChatScreen}
							/>
						)}
					</CSSTransition>
				)}
				{!isSecondaryView && isHomeScreenEnabled && (
					<CSSTransition in={!showHomeScreen} timeout={500} classNames="hidebackground">
						<HomeScreen
							showHomeScreen={showHomeScreen}
							closeButtonRef={this.homeScreenCloseButtonRef}
							onSetShowHomeScreen={onSetShowHomeScreen}
							onStartConversation={this.handleStartConversation}
							onSetShowPrevConversations={onSetShowPrevConversations}
							onClose={handleOnClose}
							config={config}
							onEmitAnalytics={onEmitAnalytics}
							onSendActionButtonMessage={this.handleSendActionButtonMessage}
						/>
					</CSSTransition>
				)}
				{
					<CSSTransition
						in={!!(!showEnabledHomeScreen || showInformationMessage)}
						timeout={500}
						classNames="slide-in"
						mountOnEnter
						unmountOnExit
					>
						<RegularLayoutContentWrapper>
							{getRegularLayoutContent()}
						</RegularLayoutContentWrapper>
					</CSSTransition>
				}
			</RegularLayoutRoot>
		);
	}

	renderFullscreenMessageLayout() {
		const { config, fullscreenMessage, onDismissFullscreenMessage, onEmitAnalytics } =
			this.props;

		const { messagePlugins } = this.state;

		return (
			<FullScreenMessage
				onSendMessage={this.sendMessage}
				config={config}
				plugins={messagePlugins}
				onSetFullscreen={() => {}}
				onDismissFullscreen={onDismissFullscreenMessage}
				message={fullscreenMessage as IMessage}
				webchatTheme={this.state.theme}
				onEmitAnalytics={onEmitAnalytics}
				action={this.sendMessage}
				theme={this.state.theme}
			/>
		);
	}

	renderHistory() {
		const {
			messages,
			typingIndicator,
			config,
			onEmitAnalytics,
			onSetScrollToPosition,
			openXAppOverlay,
		} = this.props;
		const { messagePlugins = [] } = this.state;

		const { enableTypingIndicator, messageDelay } = config.settings.behavior;
		const isTyping = typingIndicator !== "remove" && typingIndicator !== "hide";

		const isEnded = isConversationEnded(messages);

		// Find privacy message and remove it from the messages list (these message types are not displayed in the chat log). 
		// If we do not remove, it will cause the collatation of the first user message.
		const messagesExcludingPrivacyMessage = getMessagesListWithoutPrivacyMessage(messages);

		return (
			<>				
				<TopStatusMessage variant="body-regular" component="div">
					You are now talking to an AI agent.
				</TopStatusMessage>
				{messagesExcludingPrivacyMessage.map((message, index) => {
					// Lookahead if there is a user reply
					const hasReply = messages
						.slice(index + 1)
						.some(message => message.source === "user");

					return (
						<Message
							key={JSON.stringify({ message, index })}
							message={message}
							action={this.sendMessage}
							config={config}
							hasReply={hasReply}
							isConversationEnded={isEnded}
							onDismissFullscreen={() => {}}
							onEmitAnalytics={onEmitAnalytics}
							onSetFullscreen={() => this.props.onSetFullscreenMessage(message)}
							openXAppOverlay={openXAppOverlay}
							plugins={messagePlugins}
							prevMessage={messages?.[index - 1]}
							theme={this.state.theme}
						/>
					);
				})}
				{isEnded && (
					<ChatEvent
						text="Conversation ended"
						className="webchat-chip-conversation-ended"
					/>
				)}
				{enableTypingIndicator && (
					<TypingIndicator
						active={isTyping}
						delay={messageDelay}
						direction={
							config?.settings?.widgetSettings?.sourceDirectionMapping?.bot ||
							"incoming"
						}
					/>
				)}
			</>
		);
	}
}
