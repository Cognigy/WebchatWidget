import React from 'react';
import { styled } from '../../../../style';
import CloseIcon from "../../../../assets/baseline-close-24px.svg";
import IconButton from '../../../presentational/IconButton';

const UploadedFilesContainer = styled.div(({theme}) => ({
    padding: `${theme.unitSize}px ${theme.unitSize * 2}px`,
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
    overflowY: 'hidden',
    height: theme.unitSize * 7,
}));

const UploadedFilePreview = styled.div(({theme}) => ({
    padding: theme.unitSize / 2,
    marginRight: theme.unitSize,
    fontSize: 13,
    borderRadius: 4,
    maxWidth: 180,
    height: 24,
    border: '1px solid hsla(0, 0%, 0%, .1)',
    alignSelf: 'center',
    display: 'flex',
}));

const ImagePreview = styled.img(({theme}) => ({  
    borderRadius: 6,
    padding: theme.unitSize / 2,
    alignSelf: 'center',
}));

const FileNameTypography = styled.span(({theme}) => ({
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    color: 'hsla(0, 0%, 0%, .54)',
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
    "& svg" : {
        width: 18,
        height: 18,
    },
    "&:focus, &:hover": {
        fill: `${theme.primaryColor} !important`,
        outline: 'none',
    }
}));


interface IPreviewUploadedFilesProps {
    fileList: File[];
    onRemoveFileFromList: (file: File) => void;
}

class PreviewUploadedFiles extends React.PureComponent<React.HTMLProps<HTMLDivElement> & IPreviewUploadedFilesProps> {
    removeFileButtonRef: React.RefObject<HTMLButtonElement>;
   
    constructor(props) {
        super(props);
        this.removeFileButtonRef = React.createRef();
    }

    onRemoveFileButtonClick = (file) => {
        this.props.onRemoveFileFromList(file);
    }

    render() {
        const { fileList } = this.props;

        return (
            <UploadedFilesContainer>
                {fileList?.map((file, index) => (
                    <UploadedFilePreview key={index}>
                        {file.type?.includes('image') && 
                            <ImagePreview width={20} height={20} src={URL.createObjectURL(file)}/>
                        }
                        <FileNameTypography>
                            {file.name.split('.')[0]}
                        </FileNameTypography>
                        <FileExtensionTypography>
                            .{file.name.split('.')[1]}
                        </FileExtensionTypography>
                        <RemoveFileButton
                            onClick={() => this.onRemoveFileButtonClick(file)}
                            aria-label="Remove File Attacment"
                            ref={this.removeFileButtonRef}
                        >
                            <CloseIcon />
                        </RemoveFileButton>
                    </UploadedFilePreview>
                ))}
            </UploadedFilesContainer>
        );
    }
}

export default PreviewUploadedFiles;