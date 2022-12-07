import React from "react";
import { styled } from '../../../../style';


const DropZoneContainer = styled.div(({theme})=>({
    display: 'flex',
    flexDirection: 'column',
    minHeight: 40,

    "&.active-drop-zone": {
        // backgroundColor: 'hsla(0, 0%, 0%, .03)',
        // boxShadow: theme.shadow,
        boxSizing: "border-box",
        boxShadow: "0px 0px 30px 20px rgba(0,0,0,0.15) inset",
        opacity: 0.6,
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
        const { children } = this.props;
        const { isDropZoneVisible } = this.state;

        return (
            <DropZoneContainer
                ref={this.dropRef}
                className={isDropZoneVisible ? "active-drop-zone" : ""}
                onDragEnter={this.handleDragEnter}
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
