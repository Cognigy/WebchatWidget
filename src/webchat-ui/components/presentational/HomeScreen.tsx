import React from 'react';
import styled from '@emotion/styled'
import Toolbar from './Toolbar';
import Button from './Button';
import SendIcon from '../plugins/input/text/baseline-send-24px.svg';
import CloseIcon from "../../assets/baseline-close-24px.svg";
import ThumbIcon from '../../assets/thumb-up-24dp.svg';
import ThumbDownIcon from './ThumbDownIcon';
import Textarea from './Textarea';
import { IWebchatConfig } from '../../../common/interfaces/webchat-config';

const HomeScreenRoot = styled.div(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    width: '100%',
    padding: "20px 20px 35px 20px"
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

const StartButton = styled(Button)(({ theme }) => ({
    marginBottom: 16,
    flexGrow: 1,
    backgroundColor: theme.secondaryColor,
    "&:focus": {
        backgroundColor: theme.secondaryColorHover
    }
}));

const PrevConversationsButton = styled(Button)(({ theme }) => ({
    marginBottom: 24,
    flexGrow: 1,
    outline: "none",
    "&:focus": {
        color: theme.secondaryColorHover
    }
}));


interface IHomeScreenProps {
    config: IWebchatConfig;
    showHomeScreen: boolean;
    onSetShowHomeScreen: (show: boolean) => void;
}

export const HomeScreen = (props: IHomeScreenProps) => {
    const { config, showHomeScreen, onSetShowHomeScreen } = props;

    return (
        <HomeScreenRoot className="webchat-homescreen-root">
            <HomeScreenContent className="webchat-homescreen-content">
                <div className="webchat-homescreen-title">{config?.settings?.getStartedText || "Welcome to the Cognigy Webchat"}</div>
                <div className="webchat-homescreen-buttons">Button Section</div>
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