import * as React from 'react'
import {styled} from '../../style';
import Branding from '../branding/Branding'

const CLIENT_HEIGHT_OFFSET = 16 + 70; // banner + typing indicator

export interface OuterProps extends React.HTMLProps<HTMLDivElement> {
    disableBranding: boolean;
    showFocusOutline: boolean; 
 }

type InnerProps = OuterProps;

interface IState {
    height: number;
    isChatLogFocused: boolean;
}

const ChatLogWrapper = styled.div<OuterProps>(({theme}) => ({
    outline: props => props.showFocusOutline ? `1px auto ${theme.primaryWeakColor}` : "none",
}))

const ChatLog = styled.div(({theme}) => ({
    paddingTop: theme.unitSize * 2,
    "&:focus": {
        outline: "none",
    }
}));

export class ChatScroller extends React.Component<InnerProps, IState> {
    rootRef: React.RefObject<HTMLDivElement>;

    constructor(props: InnerProps) {
        super(props);

        this.state = {
            height: 0,
            isChatLogFocused: false
        }

        this.rootRef = React.createRef();
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
            this.setState({isChatLogFocused: true});
        }        
    }

    // Remove outline from the parent element when Chat log loses focus 
    handleBlur = () => {
        this.setState({isChatLogFocused: false})
    }

    render() {
        const { children, disableBranding, showFocusOutline, ...restProps } = this.props;

        return (
            <ChatLogWrapper showFocusOutline={this.state.isChatLogFocused} {...restProps}>
                {/* Focusable Chat log region*/}
                <ChatLog
                    ref={this.rootRef}
                    id="webchatChatHistoryWrapperLiveLogPanel"
                    tabIndex={0}
                    role="log"
                    aria-live="polite"
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                >
                    {children}
                </ChatLog>
                {/* Branding Logo Link */}
                {!disableBranding && <Branding />}
            </ChatLogWrapper>
        )
    }
}
