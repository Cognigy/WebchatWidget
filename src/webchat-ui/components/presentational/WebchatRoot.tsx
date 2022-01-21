import { styled } from "../../style";
import ResetCSS from "./ResetCSS";

export default styled(ResetCSS)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",

  backgroundColor: "#fafafa",

  overflow: "hidden",

  fontSize: 16,

  fontFamily: theme.fontFamily,

  "&>.content": {
    flexGrow: 1,
    minHeight: 0,
    overflowY: "auto",
  },
}));
