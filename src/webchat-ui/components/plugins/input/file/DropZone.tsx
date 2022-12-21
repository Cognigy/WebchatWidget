import React from "react";
import { styled } from '../../../../style';


const DropZoneContainer = styled.div(() => ({
        position: "absolute",
        boxShadow: "0px 0px 30px 20px rgba(0,0,0,0.1) inset",
        width: "100%",
        height: "100%",
        backgroundColor: 'hsla(0, 0%, 0%, .03)',
        top: 0  
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
        e.stopPropagation();
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
        const { children } = this.props;

        return (
            <DropZoneContainer
                ref={this.dropRef}
                onDragOver={this.handleDragOver}
                onDragLeave={e => this.handleDragLeave(e)}
                onDropCapture={this.handleDrop}
            >
                {children}
            </DropZoneContainer>
        );
    }
}

export default DropZone;
