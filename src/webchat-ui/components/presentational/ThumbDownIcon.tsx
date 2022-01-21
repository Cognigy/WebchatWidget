import ThumbIcon from "../../assets/thumb-up-24dp.svg";
import { styled } from "../../style";

const ThumbDownIcon = styled(ThumbIcon)(() => ({
  transform: "rotate(180deg)",
}));

export default ThumbDownIcon;
