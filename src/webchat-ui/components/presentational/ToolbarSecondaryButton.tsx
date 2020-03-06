import { styled } from "../../style";
import ToolbarButton from "./ToolbarButton";


const ToolbarSecondaryButton = styled(ToolbarButton)(({ theme }) => ({
    backgroundColor: 'transparent',
    border: `1px solid ${theme.primaryColor}`,
    color: theme.primaryColor
}));

export default ToolbarSecondaryButton;