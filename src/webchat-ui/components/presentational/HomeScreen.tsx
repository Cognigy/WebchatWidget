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
import { IWebchatButton } from "@cognigy/socket-client";

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
		}
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
		onSetShowHomeScreen,
		onSetShowPrevConversations,
		onClose,
		onEmitAnalytics,
		onSendActionButtonMessage,
		onStartConversation,
	} = props;

	const { homeScreen } = config.settings;

	const buttons: IWebchatButton[] = config.settings.homeScreen.conversationStarters.starters;

	const disableBranding = config?.settings?.layout?.watermark !== "default";

	const handleShowPrevConversations = () => {
		onSetShowHomeScreen(false);
		onSetShowPrevConversations(true);
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
						{config?.settings?.layout?.title || "Cognigy Webchat"}
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
						action={onSendActionButtonMessage}
						onEmitAnalytics={onEmitAnalytics}
					/>
				</HomeScreenButtons>
			</HomeScreenContent>
			<HomeScreenActions className="webchat-homescreen-actions">
				<StartButton
					onClick={onStartConversation}
					className="webchat-homescreen-send-button"
					aria-label="Start chat"
				>
					{
						config.settings.homeScreen.startConversationButtonText ||
						"Start conversation"
					}
				</StartButton>
				{
					config.settings.homeScreen.previousConversations.enabled &&
					<PrevConversationsButton onClick={handleShowPrevConversations}>
							{
								config.settings.homeScreen.previousConversations.buttonText ||
								"Previous conversations"
							}
						</PrevConversationsButton>
				}
				{/* Branding Logo Link */}
				{!disableBranding && <Branding id="cognigyHomeScreenBranding" />}
			</HomeScreenActions>
		</HomeScreenRoot>
	);
};
