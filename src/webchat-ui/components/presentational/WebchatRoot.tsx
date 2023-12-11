import styled from '@emotion/styled'
import ResetCSS from "./ResetCSS";

export default styled(ResetCSS)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',

    backgroundColor: theme.backgroundWebchat,

    overflow: 'hidden',

    fontSize: 16,

    fontFamily: theme.fontFamily,

    '&>.content': {
        flexGrow: 1,
        minHeight: 0,
        overflowY: 'auto'
    }
}));