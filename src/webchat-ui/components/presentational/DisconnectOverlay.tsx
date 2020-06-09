import * as React from 'react';
import { styled } from '../../style';
import IconButton from './IconButton';
import CloseIcon from '../../assets/baseline-close-24px.svg';

const Wrapper = styled.div(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',

    padding: theme.blockSize,
    boxSizing: 'border-box',
    backgroundColor: 'hsla(0, 0%, 0%, .33)',

    zIndex: 2,
}));

const Dialog = styled.div(({ theme }) => ({
    padding: theme.unitSize * 2,
    borderRadius: theme.unitSize,

    backgroundColor: '#fafafa',
    color: theme.greyContrastColor,

    boxShadow: theme.shadow,
}));

const HeaderIconButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    right: theme.unitSize,
    top: theme.unitSize + 1,

    color: theme.primaryContrastColor,
    fill: theme.primaryContrastColor,
}));

export default ({ isPermanent, onClose }) => {
    return (
        <Wrapper>
            <Dialog>
                {isPermanent ? (
                    <span>Connection lost. Try to reload the page</span>
                ) : (
                        <span>Connection lost. Trying to reconnect...</span>
                    )}
            </Dialog>
            <HeaderIconButton
                data-header-close-button
                onClick={onClose}
                className="webchat-header-close-button"
            >
                <CloseIcon />
            </HeaderIconButton>
        </Wrapper>
    );
};
