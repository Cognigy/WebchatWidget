import styled from '@emotion/styled'

const UnreadMessagePreview = styled.div(({ theme }) => ({
    maxWidth: '200px',
    backgroundColor: 'white',
    padding: '16px 24px',
    position: 'fixed',
    borderRadius: '16px 16px 0px',
    right: '80px',
    bottom: '100px',
    boxShadow: theme.shadow,
    color: theme.greyContrastColor,
    fontSize: '14px',
    fontFamily: "sans-serif",
}));

export default UnreadMessagePreview;