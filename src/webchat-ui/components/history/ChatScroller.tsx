import * as React from 'react'
import Branding from '../branding/Branding'

const CLIENT_HEIGHT_OFFSET = 16 + 70; // banner + typing indicator

export interface OuterProps extends React.HTMLProps<HTMLDivElement> {
    disableBranding: boolean;
 }

type InnerProps = OuterProps;

interface IState {
    height: number;
}

export class ChatScroller extends React.Component<InnerProps, IState> {
    rootRef: React.RefObject<HTMLDivElement>;

    constructor(props: InnerProps) {
        super(props);

        this.state = {
            height: 0
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

    render() {
        const { children, disableBranding, ...props } = this.props;

        return (
            <div
                {...props}
                ref={this.rootRef}
            >
                {children}
                {!disableBranding && <Branding />}
            </div>
        )
    }
}
