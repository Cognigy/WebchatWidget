import React, { FC } from "react";
import styled from "@emotion/styled";
import IconButton from "./IconButton";
import CloseIcon from "../../assets/close-16px.svg";
import GoBackIcon from "../../assets/arrow-back-16px.svg";
import MenuIcon from "../../assets/menu-16px.svg";
import Notifications from "./Notifications";
import classnames from "classnames";
import { Typography } from "@cognigy/chat-components";

const HeaderBar = styled.div(({ theme }) => ({
	alignItems: "center",
	borderBottom: `1px solid ${theme.black80}`,
	color: theme.black10,
	display: "flex",
	flexShrink: 0,
	fontSize: 18,
	fontWeight: 600,
	lineHeight: 1.3,
	margin: 0,
	padding: 20,
	resize: "vertical",
	textAlign: "center",
	zIndex: 2,
	"& .logoNameContainer": {
		alignItems: "center",
		display: "flex",
		flexDirection: "column",
		height: 79,
		marginInline: "auto",
		justifyContent: "space-between",
	},
	"& .logoNameContainer-compact": {
		flexDirection: "row",
		height: 28,
	},
	"& img:not(.compact)": {
		marginBottom: 10,
	},
}));

const BackButtonWrapper = styled.div(() => ({
	display: "flex",
	gap: 24,
}));

const HeaderIconsWrapper = styled.div(() => ({
	display: "flex",
	alignItems: "flex-start",
	gap: 24,
}));

const HeaderIconButton = styled(IconButton)(({ theme }) => ({
	color: theme.black10,
	borderRadius: 4,
	"&:focus": {
		outline: `2px solid ${theme.primaryColor}`,
	},
	"& svg": {
		fill: theme.black10,
		width: 16,
		height: 16,
	},
	padding: 0,
}));

const Logo = styled.img(() => ({
	borderRadius: "50%",
	fontSize: 12,
	width: 48,
	height: 48,
	marginInline: 8,
	"&.compact": {
		width: 28,
		height: 28,
	},
}));

interface HeaderProps {
	title: string;
	logoUrl?: string;
	hideLogo?: boolean;
	isChatOptionsButtonVisible?: boolean;
	onClose?: () => void;
	onGoBack?: () => void;
	onSetShowChatOptionsScreen?: (show: boolean) => void;
	closeButtonRef?: React.RefObject<HTMLButtonElement>;
	menuButtonRef?: React.RefObject<HTMLButtonElement>;
	chatToggleButtonRef?: React.RefObject<HTMLButtonElement>;
	mainContentRef?: React.RefObject<HTMLElement>;
}

const Header: FC<HeaderProps> = props => {
	const {
		logoUrl,
		title,
		mainContentRef,
		onClose,
		onGoBack,
		onSetShowChatOptionsScreen,
		closeButtonRef,
		menuButtonRef,
		chatToggleButtonRef,
		hideLogo,
		isChatOptionsButtonVisible,
		...rest
	} = props;

	const handleCloseClick = () => {
		onClose?.();
		// Restore focus to chat toggle button
		chatToggleButtonRef?.current?.focus?.();
	};

	const handleMenuClick = () => {
		onSetShowChatOptionsScreen?.(true);
	};

	const isCompact =
		!mainContentRef?.current ||
		mainContentRef.current.scrollHeight > mainContentRef.current.clientHeight ||
		!logoUrl ||
		hideLogo;

	return (
		<>
			<HeaderBar {...rest} className="webchat-header-bar">
				{onGoBack && (
					<BackButtonWrapper style={{ width: isChatOptionsButtonVisible ? 56 : 16 }}>
						<HeaderIconButton
							data-header-close-button
							onClick={onGoBack}
							className="webchat-header-back-button"
							aria-label="Go Back"
							ref={closeButtonRef}
						>
							<GoBackIcon />
						</HeaderIconButton>
					</BackButtonWrapper>
				)}
				<div
					className={classnames(
						"logoNameContainer",
						isCompact && "logoNameContainer-compact",
					)}
				>
					{(logoUrl && !hideLogo) && (
						<Logo
							src={logoUrl}
							className={classnames("webchat-header-logo", isCompact && "compact")}
							alt="Chat logo"
						/>
					)}
					<Typography
						variant="h2-semibold"
						id="webchatHeaderTitle"
						className="webchat-header-title"
					>
						{title}
					</Typography>
				</div>
				<HeaderIconsWrapper>
					{isChatOptionsButtonVisible && (
						<HeaderIconButton
							data-header-menu-button
							onClick={handleMenuClick}
							aria-label="Menu"
							ref={menuButtonRef}
						>
							<MenuIcon />
						</HeaderIconButton>
					)}
					{onClose && (
						<HeaderIconButton
							data-header-close-button
							onClick={handleCloseClick}
							className="webchat-header-close-button"
							aria-label="Close Chat"
							ref={closeButtonRef}
						>
							<CloseIcon />
						</HeaderIconButton>
					)}
				</HeaderIconsWrapper>
			</HeaderBar>
			<Notifications />
		</>
	);
};

export default Header;
