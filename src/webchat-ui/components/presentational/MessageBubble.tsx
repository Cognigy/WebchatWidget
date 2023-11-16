import React from 'react';
import styled from '@emotion/styled';
import { IColorProps } from '../../style';
import { IAlignmentProps } from './MessageRow';

export default styled.div<IColorProps & IAlignmentProps>(({ color, theme, align }) => ({
    padding: `${theme.unitSize * 2}px ${theme.unitSize * 3}px`,

    // prevent horizontal overflow
    minWidth: 0,
    wordBreak: 'break-word',

    // render line breaks in text
    whiteSpace: 'pre-wrap',

    borderRadius: theme.unitSize * 2,
    ...({ [align === 'left' ? 'borderBottomLeftRadius' : 'borderBottomRightRadius']: 0 }),
    boxShadow: theme.messageShadow,


    background: color === 'primary' ? theme.primaryGradient : 'white',
    color: color === 'primary' ? theme.primaryContrastColor : theme.greyContrastColor
}))