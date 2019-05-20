import { styled, IColorProps } from "../../style";
import { interactionCss, createTransition } from "../../utils/css";


export default styled.button<IColorProps>(({ color, theme }) => {

    const colors = {
        weak: theme.greyWeakColor,
        main: theme.greyColor,
        strong: theme.greyStrongColor,
        contrast: theme.greyContrastColor
    }

    if (color === 'primary') {
        colors.weak = theme.primaryWeakColor;
        colors.main = theme.primaryColor;
        colors.strong = theme.primaryStrongColor;
        colors.contrast = theme.primaryContrastColor;
    }

    return {
        ...interactionCss,

        borderRadius: theme.unitSize * 2,
        padding: `${theme.unitSize}px ${theme.unitSize * 2}px`,
        boxSizing: 'border-box',

        backgroundColor: colors.main,
        color: colors.contrast,

        textTransform: 'uppercase',
        fontWeight: 'bold',

        border: 'none',
        outline: 'none',

        cursor: 'pointer',

        transition: createTransition('background-color', 'transform', 'box-shadow'),
        transform: 'translate(0px, 0px)',

        '&:disabled': {
            opacity: .4,
            cursor: 'default',
        },

        '&:hover:not(:disabled)': {
            transform: 'translate(0px, -0px)',
            backgroundColor: colors.strong,
            boxShadow: '0 1px 1px hsla(0, 0%, 0%, .2)'
        },

        '&:active:not(:disabled)': {
            transform: 'translate(0px, 1px)',
            backgroundColor: colors.weak,
        }
    }
});