import React, { ComponentProps } from "react";
import styled from "@emotion/styled";

const InputWrapper = styled.div(({ theme }) => ({
	borderRadius: 10,
	border: `1px solid var(--basics-black-60, ${theme.black60})`,
	background: `var(--Basics-white, ${theme.white})`, 
	width: "100%",
	height: "100px",
	padding: 12,
	"&:focus-within": {
		borderColor: "transparent",
		outline: `2px solid ${theme.primaryColor}`,
	},
}));

const Input = styled.textarea(({ theme }) => ({
	padding: "0 12px 0 0",
	width: "100%",
	height: "100%",
	border: "none",
	resize: "none",

	color: theme.black10,
	fontFamily: "Figtree",
	fontSize: 14,
	fontWeight: 400,
	lineHeight: "140%",

	"&:focus": {
		outline: "none",
	},

	"&::placeholder": {
		color: theme.black10,
	},

	"&:disabled::placeholder": {
		color: theme.black40,
	},

	"::-webkit-scrollbar": {
		width: 2,
		height: 2,
		
	},
	"::-webkit-scrollbar-track": {
		backgroundColor: theme.black95,
	},
	"::-webkit-scrollbar-thumb": {
		backgroundColor: theme.black60,
	},
}));

interface IMultilineInputProps extends ComponentProps<typeof Input> {
	className?: string;
	inputRef?: React.RefObject<HTMLTextAreaElement>;
	placeholder?: string;
	dataTest?: string;
}

const MultilineInput = (props: IMultilineInputProps) => {
	const { className, inputRef, dataTest, ...restProps } = props;

	return (
		<InputWrapper>
			<Input
				{...restProps}
				data-test={dataTest}
				ref={inputRef}
				className={`${className} ${props.disabled ? "disabled" : ""}`.trim()}
			/>
		</InputWrapper>
	);
};

export default MultilineInput;
