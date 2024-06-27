import styled from '@emotion/styled';

export interface IAlignmentProps {
    align?: 'left' | 'right';
}

interface IVisibilityProps {
    hide?: boolean;
}

export default styled.div<IAlignmentProps & IVisibilityProps>(({ theme, align, hide }) => {
    let paddingLeft = theme.unitSize * 2;
    let paddingRight = theme.unitSize * 2;
    let flexDirection;
    let avatarStyles: any = {};
	const visibility: "hidden" | "visible" = hide ? "hidden" : "visible";
    
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
        flexShrink: 0,
        paddingLeft,
        paddingRight,
        transition: "visibility 0s linear 200ms",
        visibility,

        '&>*': {
            marginTop: theme.unitSize,
            marginBottom: theme.unitSize
        },

        '&>:first-child': {
            ...avatarStyles,
            flexGrow: 0,
            flexShrink: 0,
            flexBasis: 24
        },
        '&>:nth-child(n+2)': {
            // flexGrow: 1,
            minWidth: 0
        }
    }
})