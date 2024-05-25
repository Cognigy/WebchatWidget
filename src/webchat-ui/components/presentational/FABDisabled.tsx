import { styled } from "../../style";
import IconButton from "./IconButton";
const image = '../../assets/Robo1.png'; // Adjust the path as necessary


const FABDisabled = styled(IconButton)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    backgroundColor: theme.greyColor,
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    color: theme.greyContrastColor,
    fill: theme.greyContrastColor,
    overflow: 'visible',
    boxShadow: theme.shadow,
    borderRadius: '50%',
    marginTop: theme.unitSize * 2,
}));

export default FABDisabled;