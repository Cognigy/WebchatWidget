import React from "react";
import { styled } from '../../../../style';


const DropZoneContainer = styled.div(({theme})=>({
    display: 'flex',
    flexDirection: 'column',
    minHeight: 40,

    "&.active-drop-zone": {
        backgroundColor: 'hsla(0, 0%, 0%, .03)',
        boxSizing: "border-box",
        boxShadow: theme.shadow,
        "& *":{
            color: 'hsla(0, 0%, 0%, .3)',
        }
    }
    
}));

interface IDropZoneProps {
    onAddFilesToList: (fileList: File[]) => void;
}

interface IDropZoneState {
    isDropZoneVisible: boolean;
}

class DropZone extends React.PureComponent<React.HTMLProps<HTMLDivElement> & IDropZoneProps, IDropZoneState> {
    dropRef: React.RefObject<HTMLInputElement>;

    constructor(props) {
        super(props);
        this.state = {
            isDropZoneVisible: false,
        };

        this.dropRef = React.createRef();
    }

    handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        this.setState({ isDropZoneVisible: true });
    };

    handleDragOver = e => {
        e.preventDefault();
    };

    handleDragLeave = e => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ isDropZoneVisible: false });
    };

    handleDrop = e => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ isDropZoneVisible: false });
        if (e.dataTransfer?.files) {
            const { onAddFilesToList } = this.props;
            const newFilesArray = Array.prototype.slice.call(e.dataTransfer?.files);
            onAddFilesToList(newFilesArray);
		} 
    }

    render() {
        const {children} = this.props;
        const {isDropZoneVisible} = this.state;

        return (
            <div onDragEnter={this.handleDragEnter}>
                <DropZoneContainer
                    ref={this.dropRef}
                    className={isDropZoneVisible ? "active-drop-zone" : ""}
                    onDropCapture={this.handleDrop}
                    onDragOver={this.handleDragOver}
                    onDragLeave={e => this.handleDragLeave(e)}
                >
                    {children}
                </DropZoneContainer>
            </div>
        );
    }
}

export default DropZone;
