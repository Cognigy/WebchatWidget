import * as React from 'react';
import Toolbar from './Toolbar';
import Logo from './Logo';
import { styled } from '../../style';
import IconButton from './IconButton';
import CloseIcon from '../../assets/baseline-close-24px.svg';
import ThumbsUpDownIcon from '../../assets/thumbs-up-down-24dp.svg';

const HeaderBar = styled(Toolbar)(({ theme }) => ({
    boxShadow: '0 5px 18px 0 rgba(0, 0, 0, 0.08), 0 5px 32px 0 rgba(0, 0, 0, 0.08), 0 8px 58px 0 rgba(0, 0, 0, 0.08)',
    zIndex: 2,
    minHeight: 'auto',
    height: theme.unitSize * 7,
    flexBasis: theme.unitSize * 7,
    flexShrink: 0,
    fontSize: 16,
    fontWeight: 700
}))

const HeaderIconButton = styled(IconButton)(({ theme }) => ({
    color: theme.primaryContrastColor,
    fill: theme.primaryContrastColor,
    borderRadius: "50%",
    // stroke: theme.primaryContrastColor
    "&:focus, &:hover": {
        backgroundColor: theme.primaryStrongColor,
        fill: `${theme.primaryContrastColor} !important`,
        opacity: 0.85,
    }
}));

interface HeaderProps {
    title: string;
    connected: boolean;
    showRatingButton: boolean;
    onRatingButtonClick: () => void;
    logoUrl?: string;
    onClose: () => void;
    closeButtonRef?: React.RefObject<HTMLButtonElement>;
    ratingButtonRef?: React.RefObject<HTMLButtonElement>;
    chatToggleButtonRef?: React.RefObject<HTMLButtonElement>;
}

export default ({ logoUrl, connected, title, showRatingButton, onRatingButtonClick, onClose, closeButtonRef, ratingButtonRef, chatToggleButtonRef, ...props }: HeaderProps) => {
    // Close webchat window and restore focus
    const handleCloseClick = () => {
        onClose();
        chatToggleButtonRef?.current?.focus();  // Restore focus to chat toggle button
    }

    return (
        <HeaderBar color='primary' {...props} className="webchat-header-bar">
            {logoUrl && <Logo src={logoUrl} className="webchat-header-logo" aria-hidden="true" />}
            <span style={{ flexGrow: 1 }} className="webchat-header-title" role="heading" aria-level={1} id="webchatHeaderTitle">{title}</span>
            {showRatingButton &&
                <HeaderIconButton
                    onClick={onRatingButtonClick}
                    className="webchat-header-rating-button"
                    aria-label="Rate your chat"
                    id="webchatHeaderOpenRatingDialogButton"
                    ref={ratingButtonRef}
                >
                    <ThumbsUpDownIcon />
                </HeaderIconButton>
            }
            <HeaderIconButton
                data-header-close-button
                onClick={handleCloseClick}
                className="webchat-header-close-button"
                aria-label="Close Chat"
                ref={closeButtonRef}
            >
                <CloseIcon />
            </HeaderIconButton>
        </HeaderBar>
    );
};
