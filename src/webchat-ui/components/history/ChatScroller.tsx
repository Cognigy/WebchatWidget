import * as React from 'react'
import {styled} from '../../style';
import Branding from '../branding/Branding'

const CLIENT_HEIGHT_OFFSET = 16 + 70; // banner + typing indicator

export interface OuterProps extends React.HTMLProps<HTMLDivElement> {
    disableBranding: boolean;
 }

type InnerProps = OuterProps;

interface IState {
    height: number;
}

const ChatLog = styled.div(() => ({
    "&:focus": {
        outline: "none",
    }
}));

export class ChatScroller extends React.Component<InnerProps, IState> {
    rootRef: React.RefObject<HTMLDivElement>;
    wrapperRef: React.RefObject<HTMLDivElement>;

    constructor(props: InnerProps) {
        super(props);

        this.state = {
            height: 0
        }

        this.rootRef = React.createRef();
        this.wrapperRef = React.createRef();
    }

    scrollToBottom = () => {
        const root = this.rootRef.current;

        // we need the container reference to perform a scroll on it
        if (!root)
            return;

        const scrollTop = root.scrollHeight - root.clientHeight;

        try {
            root.scroll({
                top: scrollTop
            });
        } catch (e) {
            root.scrollTop = scrollTop;
        }
    }

    getSnapshotBeforeUpdate() {
        const root = this.rootRef.current;
        if (!root)
            return false;

        const isScrolledToBottom = root.scrollHeight - root.scrollTop <= root.clientHeight + CLIENT_HEIGHT_OFFSET;

        return isScrolledToBottom
    }

    componentDidUpdate(prevProps: InnerProps, prevState: IState, wasScrolledToBottom: boolean) {
        if (wasScrolledToBottom) {
            this.scrollToBottom();
        }
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    // Add outline to the parent element when Chat log receives focus
    handleFocus = () => {
        if(this.rootRef.current === document.activeElement) {
            const chatLogWrapper = this.wrapperRef.current;
            chatLogWrapper?.setAttribute("style", "outline: 1px auto black;");
        }        
    }

    // Remove outline from the parent element when Chat log loses focus 
    handleBlur = () => {
        const chatLogWrapper = this.wrapperRef.current;
        chatLogWrapper?.removeAttribute("style");
    }

    render() {
        const { children, disableBranding, className,  ...props } = this.props;

        return (
            <div className={className} ref={this.wrapperRef}>
                {/* Focusable Chat log region*/}
                <ChatLog
                    {...props}
                    ref={this.rootRef}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                >
                    {children}
                </ChatLog>
                {/* Branding Logo Link */}
                {!disableBranding && <Branding />}
            </div>
        )
    }
}
