import React from "react";
import styled from "@emotion/styled";
import CloseIcon from "../../assets/close-16px.svg";
import { IWebchatConfig, IWebchatSettings } from "../../../common/interfaces/webchat-config";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import IconButton from "./IconButton";
import Branding from "../branding/Branding";
import Notifications from "./Notifications";
import { ActionButtons } from "@cognigy/chat-components";
import { WebchatUIProps } from "../WebchatUI";

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
	if (theme.backgroundHome && settings?.backgroundImageUrl) backgroundImage = `url("${settings.backgroundImageUrl}"), ${theme.backgroundHome}`;

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
	}
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
	fill: theme.textLight,
	"&.active, &:hover": {
		color: theme.textLight,
		fill: theme.textLight,
	},
	svg: {
		width: 16,
		height: 16,
	},
}));

const HomeScreenTitle = styled.div(({ theme }) => ({
	color: theme.textLight,
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
	onSetShowPrevConversationsScreen: (show: boolean) => void;
	onClose: () => void;
	onEmitAnalytics: WebchatUIProps["onEmitAnalytics"];
}

export const HomeScreen: React.FC<IHomeScreenProps> = props => {
	const { config, onSetShowHomeScreen, onSetShowPrevConversationsScreen, onClose, onEmitAnalytics } = props;

	const disableBranding = config?.settings?.disableBranding;

	const handleShowPrevConversations = () => {
		onSetShowHomeScreen(false);
		onSetShowPrevConversationsScreen(true);
	};

	return (
		<HomeScreenRoot className="webchat-homescreen-root">
			<HomeScreenContent className="webchat-homescreen-content" settings={config?.settings}>
				<HomeScreenHeader className="webchat-homescreen-header">
					<div className="webchat-homescreen-header-title">
						{config?.settings?.title || "Cognigy Webchat"}
					</div>
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
				<HomeScreenTitle className="webchat-homescreen-title">
					{config?.settings?.getStartedButtonText || "Welcome to the Cognigy Webchat"}
				</HomeScreenTitle>
				<HomeScreenButtons className="webchat-homescreen-buttons">
					<ActionButtons
						size="large"
						showUrlIcon
						action={() => { }}
						buttonClassName="webchat-homescreen-button"
						containerClassName="webchat-homescreen-button-container"
						payload={[
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
						]}
						config={config}
						onEmitAnalytics={onEmitAnalytics}
					/>
				</HomeScreenButtons>
			</HomeScreenContent>
			<HomeScreenActions className="webchat-homescreen-actions">
				<StartButton
					onClick={() => onSetShowHomeScreen(false)}
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
