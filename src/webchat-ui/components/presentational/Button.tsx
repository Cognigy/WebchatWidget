import styled from '@emotion/styled';
import { IColorProps } from "../../style";
import { interactionCss, createTransition } from "../../utils/css";


export default styled.button<IColorProps>(({ color, theme }) => {

	const colors = {
		weak: theme.greyWeakColor,
		main: theme.greyColor,
		strong: theme.greyStrongColor,
		contrast: theme.greyContrastColor
	}

	if (color === 'primary') {
		colors.weak = theme.secondaryColorDisabled;
		colors.main = theme.secondaryColor;
		colors.strong = theme.secondaryColorHover;
		colors.contrast = theme.secondaryContrastColor;
	}

	return {
		...interactionCss,

		borderRadius: 10,
		display: "flex",
		width: 303,
		height: 44,
		padding: "11px 0px",
		justifyContent: "center",
		alignItems: "center",
		flexShrink: 0,

		backgroundColor: colors.main,
		color: colors.contrast,

		textTransform: 'unset',
		fontSize: 14,
		fontStyle: "normal",
		fontWeight: 600,
		lineHeight: "160%",

		border: 'none',
		outline: 'none',

		cursor: 'pointer',

		transition: createTransition('background-color'),

		'&:disabled': {
			opacity: .4,
			cursor: 'default',
			backgroundColor: colors.weak,
		},

		'&:hover:not(:disabled)': {
			backgroundColor: colors.strong,
		},

		'&:focus:not(:disabled)': {
			backgroundColor: colors.strong,
		},

		'&:active:not(:disabled)': {
			backgroundColor: colors.weak,
		}
	}
});