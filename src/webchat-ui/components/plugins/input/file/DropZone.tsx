import React, { FC, useRef } from "react";
import { useDispatch } from "react-redux";
import styled from "@emotion/styled";
import AttachFileIcon from "../../../../assets/attachment-16px.svg";
import { Typography } from "@cognigy/chat-components";
import Branding from "../../../branding/Branding";
import { setDropZoneVisible } from "../../../../../webchat/store/input/input-reducer";
import { addFilesToList } from "../../../../../webchat/store/input/file-input-middleware";
import { IWebchatSettings } from "../../../../../common/interfaces/webchat-config";

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
	disableBranding?: boolean;
	dropzoneText?: string;
	layoutSettings?: IWebchatSettings["layout"];
}

const DropZone: FC<IDropZoneProps> = props => {
	const dropRef = useRef<HTMLInputElement>(null);
	const dispatch = useDispatch();

	const { disableBranding, dropzoneText, layoutSettings } = props;

	const handleDragOver = e => {
		e.preventDefault();
	};

	const handleDragLeave = e => {
		e.preventDefault();
		dispatch(setDropZoneVisible(false));
	};

	const handleDrop = async e => {
		e.preventDefault();
		e.stopPropagation();
		dispatch(setDropZoneVisible(false));
		if (e.dataTransfer?.files) {
			const newFilesArray = Array.prototype.slice.call(e.dataTransfer?.files);
			dispatch(addFilesToList(newFilesArray));
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
						{dropzoneText || "Drop to attach"}
					</DragDropTypography>
				</DropZoneContent>
				<Branding
					id="cognigyDropZoneLogo"
					watermark={layoutSettings?.watermark}
					watermarkText={layoutSettings?.watermarkText}
				/>
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
