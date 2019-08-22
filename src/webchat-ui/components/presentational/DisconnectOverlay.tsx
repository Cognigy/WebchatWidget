import * as React from 'react';
import { styled } from "../../style";
import tinycolor from 'tinycolor2';

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

export default () => {
    return (
        <Wrapper>
            <Dialog>
                <span>Connection lost. Trying to reconnect...</span>
            </Dialog>
        </Wrapper>
    )
}

