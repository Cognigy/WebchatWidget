import React from 'react';
import ArrowIcon from '../../assets/arrow-back-16px.svg';
import styled from '@emotion/styled';
import Button from './Button';
import { Typography } from '@cognigy/chat-components';

interface TertiaryButtonProps {
	onClick: () => void;
}

const TertiaryButtonWrapper = styled(Button)(({ theme }) => ({
	display: "inline-flex",
	justifyContent: "center",
	alignItems: "center",
	gap: 8,
	color: theme.black10,
	backgroundColor: theme.white,
	svg: {
		transform: "rotate(180deg)",
		fill: theme.black10,
	},
	
	'& svg:dir(rtl)': {
		transform: 'rotate(0deg)',
	},

	'&:disabled': {
		cursor: 'default',
		color: theme.black60,
		backgroundColor: theme.white,
		svg: {
			fill: theme.black60,
		},
	},

	'&:hover:not(:disabled)': {
		color: theme.black40,
		backgroundColor: theme.white,
		svg: {
			fill: theme.black40,
		},
	},

	'&:focus:not(:disabled)': {
		color: theme.black40,
		backgroundColor: theme.white,
		svg: {
			fill: theme.black40,
		},
	},

	'&:active:not(:disabled)': {
		color: theme.black40,
		backgroundColor: theme.white,
		svg: {
			fill: theme.black40,
		},
	},
}));

const TertiaryButton: React.FC<TertiaryButtonProps> = ({ children, onClick }) => {
	return (
		<TertiaryButtonWrapper className="tertiary-button" onClick={onClick}>
			<Typography variant="cta-semibold" >{children}</Typography>
			<ArrowIcon />
		</TertiaryButtonWrapper>
	);
};

export default TertiaryButton;
