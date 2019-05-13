import { styled } from "../../style";
import IconButton from "./IconButton";

const FAB = styled(IconButton)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    backgroundColor: theme.primaryColor,
    backgroundImage: theme.primaryGradient,
    color: theme.primaryContrastColor,
    fill: theme.primaryContrastColor,
    overflow: 'visible',
    boxShadow: theme.shadow,
    borderRadius: '50%',
    marginTop: theme.unitSize * 2
}));

export default FAB;