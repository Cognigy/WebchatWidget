import React from 'react';
import styled from '@emotion/styled';
import CloseIcon from "../../../../assets/baseline-close-24px.svg";
import IconButton from '../../../presentational/IconButton';
import LinearProgressBar from '../../../presentational/LinearProgressBar';
import { getFileExtension, getFileName } from './helper';
import { IUploadFileMetaData } from '../../../../../common/interfaces/file-upload';

const UploadedFilesContainer = styled.div(({ theme }) => ({
    paddingRight: theme.unitSize * 2,
    paddingLeft: theme.unitSize * 2,
    paddingBottom: theme.unitSize * 3 / 2,
    paddingTop: 0,
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
    overflowY: 'hidden',
    alignItems: 'center',
}));

const FilePreviewWrapper = styled.div<Pick<IFile, "hasUploadError">>(({ theme, hasUploadError }) => ({
    marginRight: theme.unitSize,
    borderRadius: 4,
    maxWidth: 180,
    height: 34,
    border: hasUploadError ? '1px solid hsla(0, 100%, 50%, .7)' : '1px solid hsla(0, 0%, 0%, .1)',
}));

const UploadedFilePreview = styled.div(({ theme }) => ({
    padding: theme.unitSize / 2,
    fontSize: 13,
    display: 'flex',
}));

const ImagePreview = styled.img(({ theme }) => ({
    borderRadius: 6,
    padding: theme.unitSize / 2,
    alignSelf: 'center',
}));

const FileNameTypography = styled.span<Pick<IFile, "hasUploadError">>(({ theme, hasUploadError }) => ({
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    color: hasUploadError ? 'hsla(0, 100%, 50%, .7)' : 'hsla(0, 0%, 0%, .54)',
    alignSelf: 'center',
    paddingLeft: theme.unitSize / 2,
}));

const FileExtensionTypography = styled.span(() => ({
    color: 'hsla(0, 0%, 0%, .54)',
    alignSelf: 'center',
}));

const RemoveFileButton = styled(IconButton)(({ theme }) => ({
    padding: 4,
    paddingRight: 0,
    marginRight: 0,
    marginLeft: 'auto',
    "& svg": {
        width: 18,
        height: 18,
    },
    "&:focus, &:hover": {
        fill: `${theme.primaryColor} !important`,
        outline: 'none',
    }
}));

export interface IFile {
    file: File;
    progressPercentage?: number;
    uploadFileMeta?: IUploadFileMetaData;
    hasUploadError?: boolean;
    uploadErrorReason?: string;
}

interface IPreviewUploadedFilesProps {
    fileList: IFile[];
    onRemoveFileFromList: (index: number) => void;
}

class PreviewUploadedFiles extends React.PureComponent<React.HTMLProps<HTMLDivElement> & IPreviewUploadedFilesProps> {
    removeFileButtonRef: React.RefObject<HTMLButtonElement>;

    constructor(props) {
        super(props);
        this.removeFileButtonRef = React.createRef();
    }

    onRemoveFileButtonClick = (index: number) => {
        this.props.onRemoveFileFromList(index);
    }

    render() {
        const { fileList } = this.props;
        //TODO: Fix progress percentage after file upload backend is ready

        return (
            <UploadedFilesContainer>
                {fileList?.map((item, index) => (
                    <FilePreviewWrapper key={index} hasUploadError={item.hasUploadError} >
                        <UploadedFilePreview>
                            {item.file.type?.includes('image') &&
                                <ImagePreview width={20} height={20} src={URL.createObjectURL(item.file)} />
                            }
                            <FileNameTypography hasUploadError={item.hasUploadError}>
                                {!item.hasUploadError ? getFileName(item.file.name) : item.uploadErrorReason}
                            </FileNameTypography>
                            {!item.hasUploadError && <FileExtensionTypography>
                                {getFileExtension(item.file.name)}
                            </FileExtensionTypography>}
                            <RemoveFileButton
                                onClick={() => this.onRemoveFileButtonClick(index)}
                                aria-label="Remove File Attachment"
                                ref={this.removeFileButtonRef}
                            >
                                <CloseIcon />
                            </RemoveFileButton>
                        </UploadedFilePreview>
                        {item.progressPercentage && item.progressPercentage !== 100 && !item.hasUploadError &&
                            <LinearProgressBar progressPercentage={item.progressPercentage} />
                        }
                    </FilePreviewWrapper>
                ))}
            </UploadedFilesContainer>
        );
    }
}

export default PreviewUploadedFiles;