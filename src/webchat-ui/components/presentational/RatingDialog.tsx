import React from 'react';
import { styled } from "../../style";
import Toolbar from './Toolbar';
import IconButton from './IconButton';
import SendIcon from '../plugins/input/text/baseline-send-24px.svg';
import CloseIcon from "../../assets/baseline-close-24px.svg";
import ThumbIcon from '../../assets/thumb-up-24dp.svg';
import ThumbDownIcon from './ThumbDownIcon';
import Textarea from './Textarea';
import uuid from "uuid"

const Wrapper = styled.div({
    height: "100%",
    width: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "hsla(0, 0%, 0%, .33)",
    zIndex: 2,
});

const RatingDialogRoot = styled.div(({ theme }) => ({
    backgroundColor: '#fafafa',
    color: theme.greyContrastColor,
    borderRadius: theme.unitSize,
    boxShadow: theme.shadow,
    width: 300,
    fontFamily: theme.fontFamily,
}));

const RatingDialogHeader = styled.div(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: theme.unitSize * 2,
    paddingTop: theme.unitSize,
    paddingBottom: theme.unitSize,
    background: theme.primaryGradient,
    color: theme.primaryContrastColor,
    borderRadius: "8px 8px 0 0",

    'svg': {
        fill: theme.primaryContrastColor,
    },
}));

const HeaderIconButton = styled(IconButton)(({ theme }) => ({
    borderRadius: "50%",
    padding: 4,
    marginRight: 8,
    "&:focus, &:hover": {
        backgroundColor: theme.primaryStrongColor,
        fill: theme.primaryContrastColor,
        opacity: 0.85,
    }
}));

const RatingDialogMain = styled.div(({ theme }) => ({
    height: 180,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    paddingLeft: theme.unitSize * 2,
    paddingRight: theme.unitSize * 2,
}));

const RatingButtonContainer = styled.div(({ theme }) => ({
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexGrow: 1,
}));

const RatingIconButton = styled(IconButton)(({ theme, selected }) => ({
    backgroundColor: selected ? theme.primaryColor : theme.greyWeakColor,
    borderRadius: "50%",

    "&:hover": {
        backgroundColor: selected ? theme.primaryWeakColor : theme.greyColor,
        opacity: 0.85,
    },

    "&:focus": {
        boxShadow: `0 0 3px 3px ${theme.primaryWeakColor}`,
    },

    'svg': {
        width: 33,
        height: 33,
    },
}));

const RatingToolbar = styled(Toolbar)(({ theme }) => ({
    paddingBottom: theme.unitSize,
}));

const RatingInput = styled(Textarea)(({ theme }) => ({
    border: `1px solid ${theme.greyColor}`,

    "&:focus": {
        boxShadow: `0 0 0 2px ${theme.primaryWeakColor}`,
    },
}));

const SendIconButton = styled(IconButton)(({ theme }) => ({
    '&:focus': {
        color: `${theme.primaryStrongColor} !important`,
        fill: `${theme.primaryStrongColor} !important`,
    },
}));

interface IRatingDialogProps {
    onCloseRatingDialog: () => void;
    onSendRating: ({ rating: number, comment: string }) => void;
    ratingTitleText: string;
    ratingCommentText: string;
}

interface IRatingDialogState {
    ratingValue: number | null;
    ratingText: string;
}

class RatingDialog extends React.PureComponent<React.HTMLProps<HTMLDivElement> & IRatingDialogProps, IRatingDialogState> {
    commentTextAreaRef: React.RefObject<HTMLTextAreaElement>;
    sendRatingButtonRef: React.RefObject<HTMLButtonElement>;
    closeButtonInHeaderRef: React.RefObject<HTMLButtonElement>;
    
    constructor(props) {
        super(props);
        this.state = {
            ratingValue: null,
            ratingText: "",
        };

        this.commentTextAreaRef = React.createRef();
        this.sendRatingButtonRef = React.createRef();
        this.closeButtonInHeaderRef = React.createRef();
    }

    handleSetRatingText = (event) => {
        this.setState({
            ratingText: event.target.value
        });
    };

    handleSetRatingValue = (value) => {
        let nextValue = value;

        if (this.state.ratingValue === value) {
            nextValue = null;
        };

        this.setState({
            ratingValue: nextValue,
        });
    };

    restoreFocus = () => {
        const thumdsUpDownButton = document.getElementById("webchatHeaderOpenRatingDialogButton");
        if(thumdsUpDownButton) thumdsUpDownButton.focus();
    }

    handleSendRatingClick = () => {
        this.props.onSendRating({
            rating: this.state.ratingValue,
            comment: this.state.ratingText,
        });
        this.restoreFocus();
    };

    handleCloseRatingClick = () => {
        this.props.onCloseRatingDialog();
        this.restoreFocus();
    }

    handleKeydown = (event) => {
        const isSendButtonDisabled = this.state.ratingValue !== -1 && this.state.ratingValue !== 1;

        // Close the dialog when Escape key is pressed
        if(event.key === "Escape" || event.key === "Esc") {
            this.handleCloseRatingClick();
        }

        /**
         * If the current focused element is the dialog close button, the focus moves to some element 
         * outside rating dialog on 'Shift + Tab' navigation.
         * 
         * In order to trap focus within the rating dialog, move the focus back to the first focusable element from the bottom.
         * (i.e., either to send button, if enabled, or to comment text field)
         * 
         */
        if (event.target === this.closeButtonInHeaderRef?.current) {
            if (event.shiftKey && event.key === "Tab") {
                event.preventDefault();
                if (!isSendButtonDisabled) {
                    this.sendRatingButtonRef.current?.focus();
                } else {
                    this.commentTextAreaRef.current?.focus();
                } 
            }
        }
        /**
         * If the current focused element is the comment input or the send rating button, the focus moves to some element 
         * outside rating dialog on 'Tab' navigation.
         * 
         * In order to trap focus within the rating dialog, move the focus back to the 'close dialog' button on Tab navigation.
         * 
         */
        if (event.target === this.sendRatingButtonRef?.current || 
            (isSendButtonDisabled && event.target === this.commentTextAreaRef?.current)) {
            if (event.shiftKey && event.key === "Tab") {}
            else if(event.key === "Tab") {
                event.preventDefault();
                this.closeButtonInHeaderRef?.current?.focus();
            }
        }
    }

    render() {
        const { props, state } = this;
        const {
            ratingTitleText,
            ratingCommentText,
        } = props;
        const {
            ratingValue,
            ratingText,
        } = state;

        const disableSendButton = ratingValue !== -1 && ratingValue !== 1;
        const webchatRatingDialogTitleId = `webchatRatingDialogTitle-${uuid.v4()}`;
        const webchatRatingCommentLabelId = `webchatRatingCommentLabelId-${uuid.v4()}`;

        return (
            <Wrapper className="webchat-rating-dialog-wrapper">
                <RatingDialogRoot
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={webchatRatingDialogTitleId}
                    onKeyDown={this.handleKeydown}
                    className="webchat-rating-dialog-root"
                >
                    <RatingDialogHeader className="webchat-rating-dialog-header">
                        <span
                            id={webchatRatingDialogTitleId}
                            role="heading"
                            aria-level={2}
                            className="webchat-rating-dialog-title"
                        >
                            {ratingTitleText}
                        </span>
                        <HeaderIconButton
                            onClick={this.handleCloseRatingClick}
                            className="webchat-rating-dialog-header-close-button"
                            aria-label="Close Rating dialog"
                            ref={this.closeButtonInHeaderRef}
                        >
                            <CloseIcon />
                        </HeaderIconButton>
                    </RatingDialogHeader>
                    <RatingDialogMain className="webchat-rating-dialog-main-content">
                        <RatingButtonContainer className="webchat-rating-dialog-content-container">
                            <div>
                                <RatingIconButton
                                    onClick={() => this.handleSetRatingValue(1)}
                                    className="webchat-rating-dialog-thumbs-up-button"
                                    selected={ratingValue === 1}
                                    aria-pressed={ratingValue === 1}
                                    aria-label="Thumbs Up"
                                >
                                    <ThumbIcon />
                                </RatingIconButton>
                            </div>
                            <div>
                                <RatingIconButton
                                    onClick={() => this.handleSetRatingValue(-1)}
                                    className="webchat-rating-dialog-thumbs-down-button"
                                    selected={ratingValue === -1}
                                    aria-pressed={ratingValue === -1}
                                    aria-label="Thumbs Down"
                                >
                                    <ThumbDownIcon />
                                </RatingIconButton>
                            </div>
                        </RatingButtonContainer>
                        <div>
                            <div 
                                id={webchatRatingCommentLabelId}
                                className="webchat-rating-dialog-comment-input-label"
                            >
                                {ratingCommentText}
                            </div>
                        </div>
                    </RatingDialogMain>
                    <RatingToolbar className="webchat-rating-dialog-toolbar">
                        <RatingInput
                            data-test="rating-input"
                            type="text"
                            value={ratingText}
                            onChange={this.handleSetRatingText}
                            className="webchat-rating-dialog-comment-input-field"
                            autoFocus
                            maxlength={500}
                            rows={3}
                            aria-labelledby={webchatRatingCommentLabelId}
                            ref={this.commentTextAreaRef}
                        />
                        <SendIconButton
                            className={`webchat-rating-dialog-send-button ${disableSendButton ? "disabled" : "active"}`}
                            disabled={disableSendButton}
                            onClick={this.handleSendRatingClick}
                            ref={this.sendRatingButtonRef}
                            aria-label="Send Rating and Comment"
                        >
                            <SendIcon />
                        </SendIconButton>
                    </RatingToolbar>
                </RatingDialogRoot>
            </Wrapper>
        );
    }
};

export default RatingDialog;