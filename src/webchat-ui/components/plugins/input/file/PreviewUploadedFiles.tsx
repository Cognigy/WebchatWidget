import React, { FC, useRef } from "react";
import styled from "@emotion/styled";
import CloseIcon from "../../../../assets/close-10px.svg";
import IconButton from "../../../presentational/IconButton";
import LinearProgressBar from "../../../presentational/LinearProgressBar";
import { getFileExtension, getFileName } from "./helper";
import { Typography } from "@cognigy/chat-components";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../../../../../webchat/store/store";
import { IFile, removeFileFromList } from "../../../../../webchat/store/input/input-reducer";

const UploadedFilesContainer = styled.div(({ theme }) => ({
	display: "flex",
	flexDirection: "row",
	overflowX: "auto",
	overflowY: "hidden",
	alignItems: "center",
	gap: 12,

	"&::-webkit-scrollbar": {
		width: 2,
		height: 2,
		visibility: "hidden",
	},

	"&:hover": {
		"&::-webkit-scrollbar-track": {
			backgroundColor: theme.black95,
		},
		"&::-webkit-scrollbar-thumb": {
			backgroundColor: theme.black60,
		},
	},
}));

const FilePreviewWrapper = styled.div(({ theme }) => ({
	position: 'relative',
	overflow: 'hidden',
	borderRadius: 15,
	height: 33,
	backgroundColor: theme.black95,
	"&:focus-within": {
		backgroundColor: theme.black80,
	},
}));

const UploadedFilePreview = styled.div(() => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	gap: 12,
	padding: "0px 12px",
	height: "100%",
}));

const FileName = styled(Typography)<Pick<IFile, "hasUploadError">>(({ hasUploadError, theme }) => ({
	whiteSpace: "nowrap",
	textOverflow: "ellipsis",
	overflow: "hidden",
	color: hasUploadError ? "hsla(0, 100%, 50%, .7)" : theme.black10,
	alignSelf: "center",
}));

const FileSize = styled(Typography)(({ theme }) => ({
	color: theme.black40,
	alignSelf: "center",
	textWrap: "nowrap",
}));

const RemoveFileButton = styled(IconButton)(({ theme }) => ({
	padding: 0,
	"& svg": {
		width: 10,
		height: 10,
	},
	"&:focus, &:hover": {
		"& path": {
			fill: `${theme.primaryColor} !important`,
			outline: "none",
		},
	},
}));

const PreviewUploadedFiles: FC = () => {
	const removeFileButtonRefs = useRef<HTMLButtonElement[]>([]);

	const fileList = useSelector((state: StoreState) => state.input.fileList);

	const dispatch = useDispatch();

	const onRemoveFileButtonClick = (index: number) => {
		dispatch(removeFileFromList(index));
	};

	return (
		<UploadedFilesContainer>
			{fileList?.map((item, index) => (
				<FilePreviewWrapper key={index}>
					<UploadedFilePreview>
						<RemoveFileButton
							onClick={() => onRemoveFileButtonClick(index)}
							onFocus={() => {
								if (removeFileButtonRefs.current[index]) {
									removeFileButtonRefs.current[index].scrollIntoView({
										behavior: "smooth",
										inline: "center",
										block: "nearest",
									});
								}
							}}
							aria-label={`Remove File Attachment ${index + 1}`}
							ref={ref => {
								if (ref) {
									removeFileButtonRefs.current[index] = ref;
								}
							}}
						>
							<CloseIcon />
						</RemoveFileButton>
						<FileName
							component="span"
							variant="title2-regular"
							hasUploadError={item.hasUploadError}
						>
							{!item.hasUploadError
								? `${getFileName(item.file.name)}${getFileExtension(item.file.name)}`
								: item.uploadErrorReason}
						</FileName>
						<FileSize component="span" variant="title2-regular">
							{item.file.size > 1000000
								? `${(item.file.size / 1000000).toFixed(2)} MB`
								: `${(item.file.size / 1000).toFixed(2)} KB`}
						</FileSize>
					</UploadedFilePreview>
					{item.progressPercentage &&
						item.progressPercentage !== 100 &&
						!item.hasUploadError && (
							<LinearProgressBar progressPercentage={item.progressPercentage} />
						)}
				</FilePreviewWrapper>
			))}
		</UploadedFilesContainer>
	);
};

export default PreviewUploadedFiles;
