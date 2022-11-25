import * as React from 'react'
import {styled} from '../../style';
import Branding from '../branding/Branding'
import CustomBranding from '../branding/CustomBranding';

const CLIENT_HEIGHT_OFFSET = 16 + 70; // banner + typing indicator

export interface OuterProps extends React.HTMLProps<HTMLDivElement> {
    disableBranding: boolean;
    enableCustomBranding: boolean;
    customBrandingTitle: string;
    customBrandingURL: string;
    showFocusOutline: boolean; 
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
        if(this.innerRef.current === document.activeElement) {
            this.setState({isChatLogFocused: true});
        }        
    }

    // Remove outline from the parent element when Chat log loses focus 
    handleBlur = () => {
        this.setState({isChatLogFocused: false})
    }

    render() {
        const { children, disableBranding, enableCustomBranding, customBrandingTitle, customBrandingURL, showFocusOutline, ...restProps } = this.props;

        return (
            <ChatLogWrapper ref={this.rootRef} showFocusOutline={this.state.isChatLogFocused} {...restProps}>
                {/* Focusable Chat log region*/}
                <ChatLog
                    ref={this.innerRef}
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
                {
                    !disableBranding && enableCustomBranding
                    ?
                    <CustomBranding branding={customBrandingTitle} url={customBrandingURL}/>
                    :
                    !disableBranding && !enableCustomBranding
                    ?
                    <Branding />
                    :
                    null
                }
            </ChatLogWrapper>
        )
    }
}
