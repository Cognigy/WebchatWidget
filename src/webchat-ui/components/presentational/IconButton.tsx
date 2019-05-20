import { styled, IColorProps } from "../../style";
import { interactionCss, createTransition } from "../../utils/css";
import tinycolor from 'tinycolor2'

export default styled.button<IColorProps>(({ theme }) => {

    const normal = 'hsla(0, 0%, 0%, .24)';
    const highlight = 'hsla(0, 0%, 0%, .54)';

    return {
        // ...interactionCss,

        padding: theme.unitSize,
        boxSizing: 'border-box',
        color: normal,
        fill: normal,
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none',
        margin: 0,

        '&:not(.disabled)': {
            cursor: 'pointer',
        },

        transition: createTransition('background-color', 'color', 'fill'),

        'svg': {
            width: 22,
            height: 22
        },

        '&.active, &:hover': {
            color: highlight,
            fill: highlight
        }
    }
});