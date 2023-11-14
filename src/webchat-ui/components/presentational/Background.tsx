import styled from '@emotion/styled';
import { IColorProps } from "../../style";

export default styled.div<IColorProps>(({ color, theme }) => {
    switch (color) {
        case 'primary':
            return {
                background: theme.primaryGradient,
                color: theme.primaryContrastColor
            }

        case 'grey':
            return {
                backgroundColor: theme.greyColor,
                color: theme.greyContrastColor
            }

        return {}
    }
});