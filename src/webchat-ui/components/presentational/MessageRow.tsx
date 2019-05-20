import * as React from 'react';
import { styled } from '../../style';

export interface IAlignmentProps {
    align?: 'left' | 'right';
}

export default styled.div<IAlignmentProps>(({ theme, align }) => {
    let paddingLeft = theme.unitSize * 2;
    let paddingRight = theme.unitSize * 2;
    let flexDirection;
    let avatarStyles: any = {};
    
    switch (align) {
        case 'right': {
            paddingLeft = theme.blockSize;
            flexDirection = 'row-reverse';
            avatarStyles = {
                marginLeft: theme.unitSize
            }
            break;
        }

        case 'left':
        default: {
            paddingRight = theme.blockSize;
            avatarStyles = {
                marginRight: theme.unitSize
            }
        }
    }

    return {
        display: 'flex',
		flexDirection,
		alignItems: "flex-end",
        paddingLeft,
        paddingRight,

        '&>*': {
            marginTop: theme.unitSize,
            marginBottom: theme.unitSize
        },

        '&>:first-child': {
            ...avatarStyles,
            flexGrow: 0,
            flexShrink: 0,
            flexBasis: 26
        },
        '&>:nth-child(n+2)': {
            // flexGrow: 1,
            minWidth: 0
        }
    }
})