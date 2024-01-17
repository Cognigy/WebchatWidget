import React, { FC, useRef } from "react";
import styled from "@emotion/styled";
import AttachFileIcon from "../../../../assets/attachment-16px.svg";
import { Typography } from "@cognigy/chat-components";
import Branding from "../../../branding/Branding";
import { setDropZoneVisible } from "../../../../../webchat/store/input/input-reducer";
import { useDispatch } from "react-redux";

const componentStyles = () => ({
	width: "100%",
	height: "100%",
	bottom: 0,
});

const DropZoneRoot = styled.div(componentStyles, {
	display: "flex",
	flexDirection: "column",
	flexGrow: 1,
	minHeight: 0,
	padding: 12,
});

const DropZoneContent = styled.div(() => ({
	height: "100%",
	alignItems: "center",
	justifyContent: "center",
	display: "flex",
	gap: 8,
}));

const DropZoneContainer = styled.div(componentStyles, {
	position: "absolute",
});

const DragDropTypography = styled(Typography)(({ theme }) => ({
	color: theme.black10,
}));

interface IDropZoneProps {
	setIsDropZoneVisible: (isVisible: boolean) => void;
	onAddFilesToList: (fileList: File[]) => void;
}

const DropZone: FC<IDropZoneProps> = props => {
	const dropRef = useRef<HTMLInputElement>(null);
	const dispatch = useDispatch();

	const handleDragOver = e => {
		e.preventDefault();
	};

	const handleDragLeave = e => {
		e.preventDefault();
		dispatch(setDropZoneVisible(false));
	};

	const handleDrop = e => {
		e.preventDefault();
		e.stopPropagation();
		dispatch(setDropZoneVisible(false));
		if (e.dataTransfer?.files) {
			const { onAddFilesToList } = props;
			const newFilesArray = Array.prototype.slice.call(e.dataTransfer?.files);
			onAddFilesToList(newFilesArray);
		}
	};

	return (
		<>
			<DropZoneRoot>
				<DropZoneContent>
					<AttachFileIcon />
					<DragDropTypography
						variant="title1-regular"
						component="span"
						className="webchat-input-drag-and-drop-file-text"
					>
						Drop to attach
					</DragDropTypography>
				</DropZoneContent>
				<Branding />
			</DropZoneRoot>
			<DropZoneContainer
				ref={dropRef}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDropCapture={handleDrop}
			/>
		</>
	);
};

export default DropZone;
