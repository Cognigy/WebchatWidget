import React from "react";
import styled from '@emotion/styled';
import AttachFileIcon from '../../../../assets/attachment-16px.svg';
import { Typography } from "@cognigy/chat-components";

const componentStyles = (({ theme }) => ({
    position: "absolute",
    width: "100%",
    height: theme.unitSize * 15,
    bottom: 0,
}));

const DropZoneContent = styled.div(componentStyles, {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    gap: 8,
});

const DropZoneContainer = styled.div(componentStyles, {});

const DragDropTypography = styled(Typography)(({ theme }) => ({
    color: theme.black10,
}));

interface IDropZoneProps {
    setIsDropZoneVisible: (isVisible: boolean) => void;
    onAddFilesToList: (fileList: File[]) => void;
}

class DropZone extends React.PureComponent<React.HTMLProps<HTMLDivElement> & IDropZoneProps> {
    dropRef: React.RefObject<HTMLInputElement>;

    constructor(props) {
        super(props);
        this.dropRef = React.createRef();
    }

    handleDragOver = e => {
        e.preventDefault();
    };

    handleDragLeave = e => {
        e.preventDefault();
        this.props.setIsDropZoneVisible(false);
    };

    handleDrop = e => {
        e.preventDefault();
        e.stopPropagation();
        this.props.setIsDropZoneVisible(false);
        if (e.dataTransfer?.files) {
            const { onAddFilesToList } = this.props;
            const newFilesArray = Array.prototype.slice.call(e.dataTransfer?.files);
            onAddFilesToList(newFilesArray);
        }
    }

    render() {
        return (
            <>
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
                <DropZoneContainer
                    ref={this.dropRef}
                    onDragOver={this.handleDragOver}
                    onDragLeave={e => this.handleDragLeave(e)}
                    onDropCapture={this.handleDrop}
                />
            </>
        );
    }
}

export default DropZone;
