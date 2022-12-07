import React from 'react';
import { styled } from '../../../../style';
import AttachFile from './attach-file-20px.svg';
import CloseIcon from "../../../../assets/baseline-close-24px.svg";
import IconButton from '../../../presentational/IconButton';
import DropZone from './DropZone';
import PreviewUploadedFiles from './PreviewUploadedFiles';

const Wrapper = styled.div(() => ({
    display: 'flex',
    flexDirection: 'column',
    "&.active-drop-zone": {
        opacity: 0.3,
    }
}));

const AttachFileIcon = styled(AttachFile)(() => ({
    marginBottom: -4,
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
    padding: 4,
    marginRight: 0,
    marginLeft: 'auto',
    textAlign: 'end',
    "& svg" : {
        width: 18,
        height: 18,
    },
    "&:focus, &:hover": {
        fill: `${theme.primaryColor} !important`,
        outline: 'none',
    }
}));


const FileUploadContainer = styled.div(() => ({
    textAlign: 'center',
}));

const HiddenFileInput = styled.input(() => ({
    display: 'none',
}));

const AttachFileButton = styled.button(({ theme }) => ({
    padding: theme.unitSize / 2,
    backgroundColor: 'transparent',
    color: theme.primaryColor,
    boxShadow: `0 0 0 1px ${theme.primaryColor}`,
    borderRadius: theme.unitSize / 2,
    marginLeft: 6,
    marginRight: 6,
    // color: 'hsla(0, 0%, 0%, .54)',
    border: 'none',
    fontSize: 14,
    cursor: 'pointer',
    outline: 'none',
    "&:focus, &:hover": {
        // color: `${theme.primaryColor} !important`,
        color: `${theme.primaryContrastColor} !important`,
        backgroundColor: theme.primaryColor,
        outline: 'none',
    }
}));

const DragDropTypography = styled.span(() => ({
    color: 'hsla(0, 0%, 0%, .54)',
    fontSize: 14,
}));

interface IFileAttachmentSectionProps {
    fileList: File[];
    onAddFilesToList: (fileList: File[]) => void;
    onRemoveFileFromList: (index: number) => void;
    onClose: () => void;
}

interface IFileAttachmentSectionState {
    isDropZoneVisible: boolean;
}

class FileAttachmentSection extends React.PureComponent<React.HTMLProps<HTMLDivElement> & IFileAttachmentSectionProps, IFileAttachmentSectionState> {    
    fileInputRef: React.RefObject<HTMLInputElement>;
    closeButtonRef: React.RefObject<HTMLButtonElement>;

    constructor(props) {
        super(props);
        this.state = {
            isDropZoneVisible: false,
        };
        this.fileInputRef = React.createRef();
        this.closeButtonRef = React.createRef();
    }

    handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {onAddFilesToList} = this.props;
        const files = event.target.files;
        const newFilesArray = Array.prototype.slice.call(files);
        onAddFilesToList(newFilesArray);
    }

    handleUploadFile = (event) => {
        event.preventDefault();
        this.fileInputRef.current?.click();
    }

    handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        this.setState({ isDropZoneVisible: true });
    };

    handleDropZoneVisibility = (isDropZoneVisible: boolean) => {
        this.setState({ isDropZoneVisible })
    }

    render() {
        const { fileList, onClose, onAddFilesToList, onRemoveFileFromList } = this.props;
        const { isDropZoneVisible } = this.state;
        const isFileListEmpty = fileList?.length === 0;

        return (
            <>
                <Wrapper onDragEnter={this.handleDragEnter} className={isDropZoneVisible ? "active-drop-zone" : ""}>
                    <CloseButton
                        onClick={onClose}
                        aria-label="Close File Attacment"
                        ref={this.closeButtonRef}
                    >
                        <CloseIcon />
                    </CloseButton>
                    <FileUploadContainer>
                        <AttachFileIcon />
                        <DragDropTypography
                            className="webchat-input-drag-and-drop-file-text"
                        >
                            Drop files or
                        </DragDropTypography>
                        <HiddenFileInput
                            ref={this.fileInputRef}
                            type="file"
                            multiple
                            onChange={this.handleSelectFile}
                        />
                        <AttachFileButton
                            className="webchat-input-button-browse-files"
                            aria-label="Browse Files"
                            onClick={this.handleUploadFile}
                        >
                            Browse
                        </AttachFileButton>
                        {isFileListEmpty ? (
                            <div style={{height:72}} />
                        ):(
                            <PreviewUploadedFiles
                                fileList={fileList}
                                onRemoveFileFromList={onRemoveFileFromList}
                            /> 
                        )}
                    </FileUploadContainer>
                </Wrapper>
                {isDropZoneVisible &&
                    <DropZone
                        onAddFilesToList={onAddFilesToList}
                        setIsDropZoneVisible={this.handleDropZoneVisibility}
                    />
                }
            </>
        );
    }
}

export default FileAttachmentSection;