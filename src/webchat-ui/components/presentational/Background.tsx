import { styled, IColorProps } from "../../style";
import tinycolor from "tinycolor2";

export default styled.div<IColorProps>(({ color, theme }) => {
  switch (color) {
    case "primary":
      return {
        background: theme.primaryGradient,
        color: theme.primaryContrastColor,
      };

    case "grey":
      return {
        backgroundColor: theme.greyColor,
        color: theme.greyContrastColor,
      };

      return {};
  }
});
