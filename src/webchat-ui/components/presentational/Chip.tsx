import React, { ComponentProps } from "react";
import styled from "@emotion/styled";

const ChipWrapper = styled.div(() => ({
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	padding: "20px",
}));

const ChipBase = styled.span(({ theme }) => ({
	padding: "8px 12px",
	maxWidth: "250px",
	fontSize: "12px",
	fontWeight: 600,
	borderRadius: "15px",
	backgroundColor: theme.black80,
	color: theme.black20,
}));

interface IChipProps extends ComponentProps<typeof ChipBase> {
	label: string;
	withWrapper?: boolean;
}

const Chip = (props: IChipProps) => {
	const { label, withWrapper, ...chipProps } = props;

	if (!label) return null;

	if (!withWrapper) return <ChipBase {...chipProps}>{label}</ChipBase>;

	return (
		<ChipWrapper>
			<ChipBase {...chipProps}>{label}</ChipBase>
		</ChipWrapper>
	);
};

export default Chip;
