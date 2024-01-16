import React, { FC, HTMLProps, useRef } from "react";
import styled from "@emotion/styled";
import CloseIcon from "../../../../assets/close-10px.svg";
import IconButton from "../../../presentational/IconButton";
import LinearProgressBar from "../../../presentational/LinearProgressBar";
import { getFileExtension, getFileName } from "./helper";
import { IUploadFileMetaData } from "../../../../../common/interfaces/file-upload";
import { Typography } from "@cognigy/chat-components";

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
	borderRadius: 15,
	height: 33,
	backgroundColor: theme.black95,
	"&:focus-within": {
		backgroundColor: theme.black80,
	},
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
	const removeFileButtonRefs = useRef<HTMLButtonElement[]>([]);

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
							onFocus={() => {
								removeFileButtonRefs.current[index].scrollIntoView({
									behavior: "smooth",
									inline: "center",
								});
							}
							}
							aria-label={`Remove File Attachment ${index + 1}`}
							ref={ref => {
								if (ref) {
									removeFileButtonRefs.current[index] = ref;
								}
							}}
						>
							<CloseIcon />
						</RemoveFileButton>
						<span>
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
						</span>
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
