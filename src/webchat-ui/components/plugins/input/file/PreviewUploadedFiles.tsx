import React from 'react';
import { styled } from '../../../../style';
import CloseIcon from "../../../../assets/baseline-close-24px.svg";
import IconButton from '../../../presentational/IconButton';

const UploadedFilesContainer = styled.div(({theme})=> ({
    padding: `${theme.unitSize}px ${theme.unitSize * 2}px`,
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
    overflowY: 'hidden',
    height: theme.unitSize * 7,
}));

const UploadedFilePreview = styled.div(({theme})=> ({
    padding: theme.unitSize / 2,
    margin: theme.unitSize / 2,
    fontSize: 13,
    borderRadius: 4,
    minWidth: 110,
    maxWidth: 200,
    height: 24,
    border: '1px solid hsla(0, 0%, 0%, .2)',
    alignSelf: 'center',
    display: 'flex',
}));

const FileNameTypography = styled.div(({theme})=> ({
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    color: 'hsla(0, 0%, 0%, .54)',
    alignSelf: 'center',
    paddingLeft: theme.unitSize / 2,
}));

const RemoveFileButton = styled(IconButton)(({ theme }) => ({
    padding: 4,
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
    fileList: any[];
    onHandleFileList: (fileList) => void;
}

class PreviewUploadedFiles extends React.PureComponent<React.HTMLProps<HTMLDivElement> & IPreviewUploadedFilesProps> {
    removeFileButtonRef: React.RefObject<HTMLButtonElement>;
   
    constructor(props) {
        super(props);
        this.removeFileButtonRef = React.createRef();
    }

    onRemoveFileButtonClick = (file) => {
        const newFileList = this.props.fileList.filter(item => item.name !== file.name);
        this.props.onHandleFileList(newFileList)
    }

    render() {
        const { fileList } = this.props;

        return (
            <UploadedFilesContainer>
                {fileList?.map(file => (
                    <UploadedFilePreview key={file.name}>
                        {file.type?.includes('image') && 
                            <img width={24} height={24} src={URL.createObjectURL(file)}/>
                        }
                        <FileNameTypography>
                            {file.name}
                        </FileNameTypography>
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