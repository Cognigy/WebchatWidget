import { styled } from "../../style";
import ToolbarButton from './ToolbarButton';

const ToolbarPrimaryButton = styled(ToolbarButton)(({ theme }) => ({
    background: theme.primaryGradient,
    color: theme.primaryContrastColor,
}));

export default ToolbarPrimaryButton;