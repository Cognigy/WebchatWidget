import tinycolor from "tinycolor2";
import { styled } from "../../style";
import { interactionCss, createTransition } from "../../utils/css";

export default styled.input(({ theme }) => ({
  ...interactionCss,
  boxSizing: "border-box",
  borderRadius: theme.cornerSize,
  borderColor: "transparent",
  borderWidth: 2,
  borderStyle: "solid",
  outline: "none",
  padding: `${theme.unitSize}px ${theme.unitSize * 2}px`,
  backgroundColor: tinycolor("white").setAlpha(0.7).toHslString(),
  color: tinycolor("black").setAlpha(0.8).toHslString(),
  transition: createTransition("background-color", "border-color"),

  ":not(:disabled)&:hover": {
    borderColor: theme.primaryWeakColor,
  },

  ":not(:disabled)&:focus": {
    borderColor: theme.primaryColor,
  },

  ":not(:disabled)&:active": {
    borderColor: theme.primaryStrongColor,
  },
}));
