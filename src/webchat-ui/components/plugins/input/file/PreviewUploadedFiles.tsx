import React, { FC, HTMLProps, useRef } from "react";
import styled from "@emotion/styled";
import CloseIcon from "../../../../assets/close-10px.svg";
import IconButton from "../../../presentational/IconButton";
import LinearProgressBar from "../../../presentational/LinearProgressBar";
import { getFileExtension, getFileName } from "./helper";
import { IUploadFileMetaData } from "../../../../../common/interfaces/file-upload";
import { Typography } from "@cognigy/chat-components";

const UploadedFilesContainer = styled.div(() => ({
	display: "flex",
	flexDirection: "row",
	overflowX: "auto",
	overflowY: "hidden",
	alignItems: "center",
	gap: 12,
}));

const FilePreviewWrapper = styled.div(({ theme }) => ({
	borderRadius: 15,
	maxWidth: 210,
	height: 33,
	backgroundColor: theme.black95,
}));

const UploadedFilePreview = styled.div(() => ({
	display: "flex",
	gap: 12,
	padding: "8px 12px",
}));

const FileName = styled(Typography)<Pick<IFile, "hasUploadError">>(({ hasUploadError, theme }) => ({
	whiteSpace: "nowrap",
	textOverflow: "ellipsis",
	overflow: "hidden",
	color: hasUploadError ? "hsla(0, 100%, 50%, .7)" : theme.black10,
	alignSelf: "center",
}));

const FileExtension = styled(Typography)(({ theme }) => ({
	color: theme.black10,
	alignSelf: "center",
	textTransform: "uppercase",
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
		"& svg": {
			fill: `${theme.primaryColor} !important`,
			outline: "none",
		},
	},
}));

export interface IFile {
	file: File;
	progressPercentage?: number;
	uploadFileMeta?: IUploadFileMetaData;
	hasUploadError?: boolean;
	uploadErrorReason?: string;
}

interface IPreviewUploadedFilesProps extends HTMLProps<HTMLDivElement> {
	fileList: IFile[];
	onRemoveFileFromList: (index: number) => void;
}

const PreviewUploadedFiles: FC<IPreviewUploadedFilesProps> = props => {
	const { fileList, onRemoveFileFromList } = props;
	const removeFileButtonRef = useRef<HTMLButtonElement>(null);

	const onRemoveFileButtonClick = (index: number) => {
		onRemoveFileFromList(index);
	};

	return (
		<UploadedFilesContainer>
			{fileList?.map((item, index) => (
				<FilePreviewWrapper key={index}>
					<UploadedFilePreview>
						<RemoveFileButton
							onClick={() => onRemoveFileButtonClick(index)}
							aria-label="Remove File Attachment"
							ref={removeFileButtonRef}
						>
							<CloseIcon />
						</RemoveFileButton>
						<FileName
							component="span"
							variant="title2-regular"
							hasUploadError={item.hasUploadError}
						>
							{!item.hasUploadError
								? getFileName(item.file.name)
								: item.uploadErrorReason}
						</FileName>
						{!item.hasUploadError && (
							<FileExtension component="span" variant="title2-regular">
								{getFileExtension(item.file.name)}
							</FileExtension>
						)}
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
