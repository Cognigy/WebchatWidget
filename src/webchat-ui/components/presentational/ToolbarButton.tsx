import { styled } from "../../style";

const ToolbarButton = styled.button(({ theme }) => ({
    backgroundColor: theme.greyColor,
    color: theme.greyContrastColor,

    cursor: "pointer",
    border: "none",

    height: 40,

    padding: `${theme.unitSize}px ${theme.unitSize * 2}px`,
    borderRadius: theme.unitSize * 2,
}));

export default ToolbarButton;