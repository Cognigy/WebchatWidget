import React from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled'
import { IWebchatTheme } from '../../style';
import tinycolor from 'tinycolor2';

const bounce = (theme: IWebchatTheme) => keyframes({
    '0%': {
        transform: 'translateY(0px)',
        backgroundColor: tinycolor(theme.primaryContrastColor).setAlpha(.54).toString()
    },
    '28%': {
        transform: `translateY(-${theme.unitSize}px)`,
        backgroundColor: tinycolor(theme.primaryContrastColor).setAlpha(.8).toString()
    },
    '44%': {
        transform: 'translateY(0px)',
        backgroundColor: tinycolor(theme.primaryContrastColor).setAlpha(.8).toString()
    }
});

const Container = styled.div(({ theme }) => ({
    paddingTop: theme.unitSize,
    whiteSpace: "nowrap",
    height: 11,
    width: theme.unitSize * 4,
    marginBottom: -theme.unitSize / 4
}))

const Dot = styled.div(({ theme }) => ({
    animation: `${bounce(theme)} 1.5s infinite ease-out`,
    borderRadius: theme.unitSize / 2,
    display: 'inline-block',
    height: theme.unitSize / 1.5,
    width: theme.unitSize / 1.5,
    marginRight: theme.unitSize / 2,
    backgroundColor: tinycolor(theme.primaryContrastColor).setAlpha(.24).toString(),

    '&:nth-of-type(1)': {
        marginLeft: theme.unitSize / 2,
        animationDelay: '200ms'
    },

    '&:nth-of-type(2)': {
        animationDelay: '300ms'
    },

    '&:nth-of-type(3)': {
        animationDelay: '400ms'
    },
}));

const TypingIndicatorDots = () => (
    <Container>
        <Dot />
        <Dot />
        <Dot />
    </Container>
);

export default TypingIndicatorDots