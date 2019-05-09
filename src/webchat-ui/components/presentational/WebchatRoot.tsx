import { styled } from "../../style";
import ResetCSS from "./ResetCSS";

export default styled(ResetCSS)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',

    backgroundColor: '#fafafa',

    width: theme.blockSize * 6,
    height: theme.blockSize * 8,
    overflow: 'hidden',

    fontSize: 16,

    fontFamily: theme.fontFamily,

    '&>.content': {
        flexGrow: 1,
        minHeight: 0,
        overflowY: 'auto'
    }
}));