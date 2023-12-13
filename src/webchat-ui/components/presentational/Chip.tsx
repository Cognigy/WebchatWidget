import React, { ComponentProps } from "react";
import styled from "@emotion/styled";
import { Typography } from "@cognigy/chat-components";

const ChipWrapper = styled.div(() => ({
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	padding: "20px",
}));

const ChipBase = styled(Typography)(({ theme }) => ({
	padding: "8px 12px",
	maxWidth: "250px",
	lineHeight: "normal",
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
			<ChipBase variant="title2-semibold" component="span" {...chipProps}>{label}</ChipBase>
		</ChipWrapper>
	);
};

export default Chip;
