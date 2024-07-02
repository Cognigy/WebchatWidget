import React from "react";
import styled from "@emotion/styled";
import classNames from "classnames";

interface IToggleButtonProps {
	onClick: () => void;
	isActive: boolean;
	disabled?: boolean;
	className?: string;
}

const StyledToggleButtonOuter = styled.button<IToggleButtonProps>(({ theme, isActive, disabled }) => ({
	display: "flex",
	alignItems: "center",
	padding: 1,
	width: 30,
	height: 16,
	borderRadius: 15,
	border: `1px solid ${theme.black80}`,
	backgroundColor: theme.white,
	cursor: disabled ? "default" : "pointer",
	transition: "background-color 0.2s ease-in-out",

	"&.active": {
		backgroundColor: disabled ? theme.secondaryColorDisabled : theme.secondaryColor,

		"&:hover": {
			backgroundColor: disabled ? theme.secondaryColorDisabled : theme.secondaryColorHover,
		},
	},
}));

const StyledToggleButtonInner = styled.div<IToggleButtonProps>(({ theme, isActive, disabled }) => ({
	width: 12,
	height: 12,
	borderRadius: 12,
	backgroundColor: disabled ? theme.secondaryColorDisabled : theme.secondaryColor,
	cursor: disabled ? "default" : "pointer",
	transform: isActive ? "translateX(14px)" : "translateX(0px)",
	transition: "transform 0.2s ease-in-out, background-color 0.2s ease-in-out",

	"&:hover": {
		backgroundColor: disabled ? theme.secondaryColorDisabled : theme.secondaryColorHover,
	},
	"&.hovered": {
		backgroundColor: disabled ? theme.secondaryColorDisabled : theme.secondaryColorHover,
	},

	"&.active": {
		backgroundColor: theme.white,
	},

}));

export const ToggleButton = (props: IToggleButtonProps) => {
	const { onClick, isActive, className, disabled } = props;

	const [isHovered, setIsHovered] = React.useState(false);

	return (
		<StyledToggleButtonOuter
			className={classNames(className, "webchat-toggle-button-root", isActive && "active")}
			onClick={onClick}
			isActive={isActive}
			disabled={disabled}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<StyledToggleButtonInner
				className={classNames("webchat-toggle-button-inner-circle", isActive && "active", isHovered && "hovered")}
				onClick={onClick}
				isActive={isActive}
				disabled={disabled}
			/>
		</StyledToggleButtonOuter>
	);
};