import * as React from 'react';
import { styled } from '../../style';

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

export default ({ isPermanent }) => {
    return (
        <Wrapper>
            <Dialog>
                {isPermanent ? (
                    <span>Connection lost. Try to reload the page</span>
                ) : (
                    <span>Connection lost. Trying to reconnect...</span>
                )}
            </Dialog>
        </Wrapper>
    );
};
