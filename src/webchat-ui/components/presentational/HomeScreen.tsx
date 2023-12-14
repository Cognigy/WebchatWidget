import React from "react";
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
import { PrevConversationsState } from "../../../webchat/store/previous-conversations/previous-conversations-reducer";

const HomeScreenRoot = styled.div(({ theme }) => ({
	display: "flex",
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
}));

interface IHomeScreenContentProps {
	settings: IWebchatSettings;
}

const HomeScreenContent = styled.div<IHomeScreenContentProps>(({ theme, settings }) => {
	let backgroundImage = "none";
	if (theme.backgroundHome) backgroundImage = theme.backgroundHome;
	if (settings?.backgroundImageUrl) backgroundImage = `url("${settings.backgroundImageUrl}")`;
	if (theme.backgroundHome && settings?.backgroundImageUrl)
		backgroundImage = `url("${settings.backgroundImageUrl}"), ${theme.backgroundHome}`;

	return {
		backgroundImage,
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
}));

const HomeScreenHeaderIconButton = styled(IconButton)(({ theme }) => ({
	color: theme.textLight,
	"&.active, &:hover": {
		color: theme.textLight,
		fill: theme.textLight,
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
}));

const HomeScreenActions = styled.div(({ theme }) => ({
	alignSelf: "flex-end",
	display: "flex",
	flexDirection: "column",
	alignItems: " center",
	justifyContent: "center",
	width: "100%",
	padding: "20px 20px 12px 20px",
	backgroundColor: theme.backgroundWebchat,
}));

const StartButton = styled(PrimaryButton)(() => ({
	marginBottom: 16,
	flexGrow: 1,
}));

const PrevConversationsButton = styled(SecondaryButton)(() => ({
	marginBottom: 24,
	flexGrow: 1,
}));

interface IHomeScreenProps {
	config: IWebchatConfig;
	currentSession: string;
	showHomeScreen: boolean;
	onSetShowHomeScreen: (show: boolean) => void;
	onSetShowPrevConversations: (show: boolean) => void;
	onSwitchSession: (sessionId?: string, conversation?: PrevConversationsState[string]) => void;
	onClose: () => void;
	onEmitAnalytics: WebchatUIProps["onEmitAnalytics"];
	onSendActionButtonMessage: WebchatUIProps["onSendMessage"];
}

export const HomeScreen: React.FC<IHomeScreenProps> = props => {
	const {
		config,
		currentSession,
		onSetShowHomeScreen,
		onSetShowPrevConversations,
		onSwitchSession,
		onClose,
		onEmitAnalytics,
		onSendActionButtonMessage,
	} = props;

	// TODO: Load buttons from new endpoint config
	const buttons = [
		{
			title: "Cognigy Homepage",
			type: "web_url",
			url: "https://www.cognigy.com/",
		},
		{
			title: "How are you?",
			type: "postback",
			payload: "How are you?",
		},
		{
			title: "What is your name?",
			type: "postback",
			payload: "What is your name?",
		},
		{
			title: "What is your favorite color?",
			type: "postback",
			payload: "What is your favorite color?",
		},
	]

	const disableBranding = config?.settings?.disableBranding;

	const handleShowPrevConversations = () => {
		onSetShowHomeScreen(false);
		onSetShowPrevConversations(true);
	};

	const handleStartConversation = () => {
		const { initialSessionId } = config;
		if (!initialSessionId) {
			onSwitchSession();
		}
		if (initialSessionId && initialSessionId !== currentSession) {
			onSwitchSession(initialSessionId);
		}
		onSetShowHomeScreen(false);
	};

	return (
		<HomeScreenRoot className="webchat-homescreen-root">
			<HomeScreenContent className="webchat-homescreen-content" settings={config?.settings}>
				<HomeScreenHeader className="webchat-homescreen-header">
					<Typography
						variant="title1-semibold"
						component="h2"
						fontWeight={700}
						margin={0}
						className="webchat-homescreen-header-title"
					>
						{config?.settings?.title || "Cognigy Webchat"}
					</Typography>
					<HomeScreenHeaderIconButton
						onClick={onClose}
						className="webchat-homescreen-close-button"
						aria-label="Close"
						color="primary"
					>
						<CloseIcon />
					</HomeScreenHeaderIconButton>
				</HomeScreenHeader>
				<FullWidthContainer>
					<Notifications />
				</FullWidthContainer>
				<HomeScreenTitle variant="title1-semibold" component="h4" className="webchat-homescreen-title">
					{config?.settings?.getStartedButtonText || "Welcome to the Cognigy Webchat"}
				</HomeScreenTitle>
				<HomeScreenButtons className="webchat-homescreen-buttons">
					<ActionButtons
						size="large"
						showUrlIcon
						buttonClassName="webchat-homescreen-button"
						containerClassName="webchat-homescreen-button-container"
						payload={buttons}
						config={config}
						action={onSendActionButtonMessage}
						onEmitAnalytics={onEmitAnalytics}
					/>
				</HomeScreenButtons>
			</HomeScreenContent>
			<HomeScreenActions className="webchat-homescreen-actions">
				<StartButton
					onClick={handleStartConversation}
					className="webchat-homescreen-send-button"
					aria-label="Start chat"
				>
					Start conversation
				</StartButton>
				<PrevConversationsButton onClick={handleShowPrevConversations}>
					Previous conversations
				</PrevConversationsButton>
				{/* Branding Logo Link */}
				{!disableBranding && <Branding />}
			</HomeScreenActions>
		</HomeScreenRoot>
	);
};
