import styled from '@emotion/styled';
import Button from "./Button";

export default styled(Button)(({ theme }) => ({
	color: theme.secondaryColor,
	backgroundColor: theme.white,
	border: `1px solid ${theme.secondaryColor}`,

	'&:disabled': {
		opacity: .4,
		cursor: 'default',
		color: theme.secondaryColorDisabled,
		borderColor: theme.secondaryColorDisabled,
		backgroundColor: theme.white,
	},

	'&:hover:not(:disabled)': {
		color: theme.secondaryColorHover,
		borderColor: theme.secondaryColorHover,
		backgroundColor: theme.white,
	},

	'&:focus:not(:disabled)': {
		color: theme.secondaryColorHover,
		borderColor: theme.secondaryColorHover,
		backgroundColor: theme.white,
	},

	'&:active:not(:disabled)': {
		color: theme.secondaryColorDisabled,
		borderColor: theme.secondaryColorDisabled,
		backgroundColor: theme.white,
	},
}));