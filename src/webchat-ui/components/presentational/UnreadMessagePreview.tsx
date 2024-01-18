import styled from '@emotion/styled'

const UnreadMessagePreview = styled.div(({ theme }) => ({
	width: '335px',
	backgroundColor: theme.backgroundBotMessage,
	padding: '16px',
	borderRadius: '15px',
	boxShadow: '0px 4px 6px 0px rgba(28, 28, 28, 0.20)',
	border: '1px solid rgba(26, 26, 26, 0.10)',

	cursor: 'pointer',

	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'flex-start',
	gap: '16px',
}));

export default UnreadMessagePreview;