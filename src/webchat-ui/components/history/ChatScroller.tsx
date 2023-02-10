import * as React from 'react'
import {styled} from '../../style';
import Branding from '../branding/Branding'

const CLIENT_HEIGHT_OFFSET = 16 + 70; // banner + typing indicator

export interface OuterProps extends React.HTMLProps<HTMLDivElement> {
    disableBranding: boolean;
    showFocusOutline: boolean;
    scrollToPosition: number;
    setScrollToPosition?: (position: number) => void;
    tabIndex: 0 | -1;
 }

type InnerProps = OuterProps;

interface IState {
    height: number;
    isChatLogFocused: boolean;
}

const ChatLogWrapper = styled.div<OuterProps>(({theme}) => props => ({
    outline: props.showFocusOutline ? `1px auto ${theme.primaryWeakColor}` : "none",
}))

const ChatLog = styled.div(({theme}) => ({
    paddingTop: theme.unitSize * 2,
    "&:focus": {
        outline: "none",
    }
}));

export class ChatScroller extends React.Component<InnerProps, IState> {
    rootRef: React.RefObject<HTMLDivElement>;
    innerRef: React.RefObject<HTMLDivElement>

    constructor(props: InnerProps) {
        super(props);

        this.state = {
            height: 0,
            isChatLogFocused: false
        }

        this.rootRef = React.createRef();
        this.innerRef = React.createRef();
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

    scrollToPosition = (position: number) => {
        const root = this.rootRef.current;

        // we need the container reference to perform a scroll on it
        if (!root)
            return;

        try {
            root.scroll({
                top: position - 70
            });
        } catch (e) {
            root.scrollTop = position;
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
        const { setScrollToPosition, scrollToPosition } = this.props;
        if(scrollToPosition && setScrollToPosition) {
            this.scrollToPosition(scrollToPosition);
            setScrollToPosition(0);
        } else if (wasScrolledToBottom) {
            this.scrollToBottom();
        }
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    // Add outline to the parent element when Chat log receives focus
    handleFocus = () => {
        if(this.innerRef.current === document.activeElement) {
            this.setState({isChatLogFocused: true});
        }        
    }

    // Remove outline from the parent element when Chat log loses focus 
    handleBlur = () => {
        this.setState({isChatLogFocused: false})
    }

    render() {
        const { children, disableBranding, showFocusOutline, tabIndex, ...restProps } = this.props;

        return (
            <ChatLogWrapper ref={this.rootRef} showFocusOutline={this.state.isChatLogFocused} {...restProps}>
                {/* Focusable Chat log region*/}
                <ChatLog
                    ref={this.innerRef}
                    id="webchatChatHistoryWrapperLiveLogPanel"
                    tabIndex={tabIndex}
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
