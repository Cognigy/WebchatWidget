import React from 'react';
import styled from '@emotion/styled'
import Toolbar from './Toolbar';
import Button from './Button';
import SendIcon from '../plugins/input/text/baseline-send-24px.svg';
import CloseIcon from "../../assets/close-16px.svg";
import ThumbIcon from '../../assets/thumb-up-24dp.svg';
import ThumbDownIcon from './ThumbDownIcon';
import Textarea from './Textarea';
import { IWebchatConfig } from '../../../common/interfaces/webchat-config';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import IconButton from './IconButton';

const HomeScreenRoot = styled.div(({ theme }) => ({
    display: 'flex',
	flexDirection: 'column',
    height: '100%',
    width: '100%',
    color: theme.primaryContrastColor,
    fontSize: 16,
    fontWeight: 700,
    boxSizing: 'border-box',

    '& *': {
        boxSizing: 'border-box',
    }
}));

const HomeScreenContent = styled.div(({ theme }) => ({
    background: theme.backgroundHome,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
	alignItems: 'flex-start',
	justifyContent: 'flex-start',
	height: '100%',
	width: '100%',
	padding: "20px 20px 35px 20px"
}));

const HomeScreenHeader = styled.div(({ theme }) => ({
	display: 'flex',
	flexDirection: 'row',
    alignItems: 'center',
	justifyContent: 'space-between',
    width: '100%',
	marginBottom: 20,
}));

const HomeScreenHeaderIconButton = styled(IconButton)(({ theme }) => ({
	color: theme.textLight,
	fill: theme.textLight,
	'&.active, &:hover': {
		color: theme.textLight,
		fill: theme.textLight,
	},
	'svg': {
		width: 16,
		height: 16
	},
}));

const HomeScreenTitle = styled.div(({ theme }) => ({
	color: theme.textLight,
}));

const HomeScreenButtons = styled.div(({ theme }) => ({
	marginTop: 'auto',
}));

const HomeScreenActions = styled.div(({ theme }) => ({
    alignSelf: 'flex-end',
    display: 'flex',
    flexDirection: 'column',
    alignItems: ' center',
    justifyContent: 'center',
    width: '100%',
    padding: "20px 20px 12px 20px",
    backgroundColor: theme.backgroundWebchat,
}));

const StartButton = styled(PrimaryButton)(({ theme }) => ({
    marginBottom: 16,
	flexGrow: 1,
}));

const PrevConversationsButton = styled(SecondaryButton)(({ theme }) => ({
    marginBottom: 24,
	flexGrow: 1,
}));


interface IHomeScreenProps {
    config: IWebchatConfig;
    showHomeScreen: boolean;
    onSetShowHomeScreen: (show: boolean) => void;
	onClose: () => void;
}

export const HomeScreen = (props: IHomeScreenProps) => {
	const { config, showHomeScreen, onSetShowHomeScreen, onClose } = props;

    return (
        <HomeScreenRoot className="webchat-homescreen-root">
            <HomeScreenContent className="webchat-homescreen-content">
				<HomeScreenHeader className="webchat-homescreen-header">
					<div className="webchat-homescreen-header-title">{config?.settings?.title || "Cognigy Webchat"}</div>
					<HomeScreenHeaderIconButton
						onClick={onClose}
						className="webchat-homescreen-close-button"
						aria-label="Close"
						color='primary'
					>
						<CloseIcon />
					</HomeScreenHeaderIconButton>
				</HomeScreenHeader>
				<HomeScreenTitle className="webchat-homescreen-title">
					{config?.settings?.getStartedButtonText || "Welcome to the Cognigy Webchat"}
				</HomeScreenTitle>
				<HomeScreenButtons className="webchat-homescreen-buttons">
					Button Section
				</HomeScreenButtons>
            </HomeScreenContent>
            <HomeScreenActions className="webchat-homescreen-actions">
                <StartButton
                    onClick={() => onSetShowHomeScreen(false)}
                    className="webchat-homescreen-send-button" aria-label="Start chat"
                >
                    Start conversation
                </StartButton>
                <PrevConversationsButton
                    onClick={() => console.log("Clicked Previous conversations")}
                >
                    Previous conversations
                </PrevConversationsButton>
            </HomeScreenActions>
        </HomeScreenRoot>
    );
}