import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import CloseIcon from "../../assets/close-16px.svg";
import { IWebchatConfig, IWebchatSettings } from "../../../common/interfaces/webchat-config";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import IconButton from "./IconButton";
import Branding from "../branding/Branding";
import Notifications from "./Notifications";
import { ActionButtons, Typography } from "@cognigy/chat-components";
import { WebchatUIProps } from "../WebchatUI";
import { IWebchatButton } from "@cognigy/socket-client";
import CognigyAIAvatar from "../../assets/cognigy-ai-avatar-48px.svg";
import { Logo } from "./Header";
import getKeyboardFocusableElements from "../../utils/find-focusable";

const HomeScreenRoot = styled.div(({ theme }) => ({
	display: "flex",
	position: "absolute",
	top: 0,
	flexDirection: "column",
	height: "100%",
	width: "100%",
	color: theme.primaryContrastColor,
	fontSize: 16,
	fontWeight: 700,
	boxSizing: "border-box",

	"& *": {
		boxSizing: "border-box",
	},

	"&.hidebackground-enter-done": {
		"& .webchat-homescreen-content": {
			backgroundImage: "none",
		},
	},
}));

interface IHomeScreenContentProps {
	settings: IWebchatSettings;
}

const HomeScreenContent = styled.div<IHomeScreenContentProps>(({ theme, settings }) => {
	const backgroundColor = settings?.homeScreen?.background?.color || theme.backgroundHome;

	let backgroundImage = "none";
	const backgroundImageURL = settings?.homeScreen?.background?.imageUrl;
	if (backgroundImageURL) backgroundImage = `url("${backgroundImageURL}")`;

	const background = `${backgroundImage}, ${backgroundColor}`;

	return {
		background,
		backgroundSize: "cover",
		backgroundPosition: "center center",
		flexGrow: 1,
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
		justifyContent: "flex-start",
		height: "100%",
		width: "100%",
		padding: "20px 20px 35px 20px",
	};
});

const FullWidthContainer = styled.div(() => ({
	marginInline: -20,
	width: "calc(100% + 40px)",
}));

const HomeScreenHeader = styled.div(() => ({
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
	justifyContent: "space-between",
	width: "100%",
	marginBottom: 20,
	height: 28,
	"& .webchat-homescreen-header-logo": {
		borderRadius: "50%",
		width: 28,
		height: 28,
	},
	"& .webchat-homescreen-header-cognigy-logo": {
		borderRadius: "50%",
		width: 28,
		height: 28,
	},
}));

const HomeScreenHeaderIconButton = styled(IconButton)(({ theme }) => ({
	color: theme.textLight,
	borderRadius: 4,
	"&.active, &:hover": {
		color: theme.textLight,
		fill: theme.textLight,
	},
	"&:focus-visible": {
		outline: `2px solid ${theme.textLight}`,
		outlineOffset: 2,
	},
	svg: {
		fill: theme.textLight,
		width: 16,
		height: 16,
	},
}));

const HomeScreenTitle = styled(Typography)(({ theme }) => ({
	color: theme.textLight,
	fontWeight: 700,
	margin: 0,
}));

const HomeScreenButtons = styled.div(() => ({
	marginTop: "auto",
	"> div": {
		flexDirection: "column",
	},
}));

const HomeScreenActions = styled.div(({ theme }) => ({
	alignSelf: "flex-end",
	display: "flex",
	flexDirection: "column",
	alignItems: " center",
	justifyContent: "center",
	width: "100%",
	padding: "20px 20px 12px 20px",
	backgroundColor: theme.white,
}));

const StartButton = styled(PrimaryButton)(({ theme }) => ({
	marginBottom: 16,
	flexGrow: 1,
	"&:focus-visible": {
		outline: `2px solid ${theme.primaryColor}`,
		outlineOffset: 2,
	},
}));

const PrevConversationsButton = styled(SecondaryButton)(({ theme }) => ({
	marginBottom: 24,
	flexGrow: 1,
	"&:focus-visible": {
		outline: `2px solid ${theme.primaryColor}`,
		outlineOffset: 2,
	},
}));

interface IHomeScreenProps {
	config: IWebchatConfig;
	showHomeScreen: boolean;
	onSetShowHomeScreen: (show: boolean) => void;
	onSetShowPrevConversations: (show: boolean) => void;
	onClose: () => void;
	onEmitAnalytics: WebchatUIProps["onEmitAnalytics"];
	onSendActionButtonMessage: WebchatUIProps["onSendMessage"];
	onStartConversation: () => void;
}

export const HomeScreen: React.FC<IHomeScreenProps> = props => {
	const {
		config,
		showHomeScreen,
		onSetShowHomeScreen,
		onSetShowPrevConversations,
		onClose,
		onEmitAnalytics,
		onSendActionButtonMessage,
		onStartConversation,
	} = props;

	const homeScreenRef = useRef<HTMLDivElement>(null);

	const { homeScreen } = config.settings;

	const buttons: IWebchatButton[] = config.settings.homeScreen.conversationStarters.starters;

	const handleShowPrevConversations = () => {
		onSetShowHomeScreen(false);
		onSetShowPrevConversations(true);
	};

	// Get all focusable elemnents inside homeScreen root and set tabindex to -1, if the homescreen is visually hidden
	useEffect(() => {
		const tabIndex = showHomeScreen ? 0 : -1;

		if (homeScreenRef.current) {
			const { focusable } = getKeyboardFocusableElements(homeScreenRef.current);

			focusable.forEach((el: Element) => {
				el.setAttribute("tabindex", tabIndex.toString());
			});
		}
	}, [showHomeScreen]);

	return (
		<HomeScreenRoot className="webchat-homescreen-root" aria-hidden={!showHomeScreen} ref={homeScreenRef}>
			<HomeScreenContent className="webchat-homescreen-content" settings={config?.settings}>
				<HomeScreenHeader className="webchat-homescreen-header">
					{config?.settings?.layout?.logoUrl ? (
						<Logo
							src={config?.settings?.layout?.logoUrl}
							className={"webchat-homescreen-header-logo"}
							alt="Chat logo"
						/>
					) : (
						<CognigyAIAvatar className={"webchat-homescreen-header-cognigy-logo"} />
					)}
					<HomeScreenHeaderIconButton
						onClick={onClose}
						className="webchat-homescreen-close-button"
						aria-label="Close chat"
						color="primary"
					>
						<CloseIcon />
					</HomeScreenHeaderIconButton>
				</HomeScreenHeader>
				<FullWidthContainer>
					<Notifications />
				</FullWidthContainer>
				<HomeScreenTitle
					variant="title1-semibold"
					component="h4"
					className="webchat-homescreen-title"
				>
					{homeScreen.welcomeText || "Welcome to the Cognigy Webchat"}
				</HomeScreenTitle>
				<HomeScreenButtons className="webchat-homescreen-buttons">
					<ActionButtons
						size="large"
						showUrlIcon
						buttonClassName="webchat-homescreen-button"
						containerClassName="webchat-homescreen-button-container"
						payload={buttons}
						config={config}
						action={showHomeScreen ? onSendActionButtonMessage : undefined}
						onEmitAnalytics={onEmitAnalytics}
					/>
				</HomeScreenButtons>
			</HomeScreenContent>
			<HomeScreenActions className="webchat-homescreen-actions">
				<StartButton
					onClick={onStartConversation}
					className="webchat-homescreen-send-button"
					data-test="webchat-start-chat-button"
				>
					{config.settings.homeScreen.startConversationButtonText || "Start conversation"}
				</StartButton>
				{config.settings.homeScreen.previousConversations.enabled && (
					<PrevConversationsButton onClick={handleShowPrevConversations}>
						{config.settings.homeScreen.previousConversations.buttonText ||
							"Previous conversations"}
					</PrevConversationsButton>
				)}
				{/* Branding Logo Link */}
				<Branding
					id="cognigyHomeScreenBranding"
					watermark={config?.settings?.layout?.watermark}
					watermarkText={config?.settings?.layout?.watermarkText}
				/>
			</HomeScreenActions>
		</HomeScreenRoot>
	);
};
