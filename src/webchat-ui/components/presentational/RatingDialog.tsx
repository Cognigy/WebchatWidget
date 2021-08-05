import React, { ChangeEventHandler } from 'react';
import { styled } from "../../style";
import Toolbar from './Toolbar';
import IconButton from './IconButton';
import SendIcon from '../plugins/input/text/baseline-send-24px.svg';
import CloseIcon from "../../assets/baseline-close-24px.svg";
import ThumbIcon from '../../assets/thumb-up-24dp.svg';
import ThumbDownIcon from './ThumbDownIcon';
import Textarea from './Textarea';

const Wrapper = styled.div({
    height: "100%",
    width: "100%",
    position: "absolute",
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

    "&:focus, &:hover": {
        backgroundColor: selected ? theme.primaryWeakColor : theme.greyColor,
        opacity: 0.85,
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
    borderColor: theme.primaryWeakColor,
}));

interface IRatingDialogProps {
    onCloseRatingDialog: () => void;
    ratingValue: number | null;
    ratingText: string;
    onSetRatingText: ChangeEventHandler<HTMLInputElement>;
    onSetPositiveRating: () => void;
    onSetNegativeRating: () => void;
    onSendRating: () => void;
    disableSendButton: boolean;
    ratingTitleText: string;
    ratingCommentText: string;
}

export default ({
    onCloseRatingDialog,
    ratingValue,
    ratingText,
    onSetRatingText,
    onSetPositiveRating,
    onSetNegativeRating,
    onSendRating,
    disableSendButton,
    ratingTitleText,
    ratingCommentText,
    ...props
}: IRatingDialogProps) => (
    <Wrapper>
        <RatingDialogRoot>
            <RatingDialogHeader>
                <span>{ratingTitleText}</span>
                <IconButton onClick={onCloseRatingDialog}>
                    <CloseIcon />
                </IconButton>
            </RatingDialogHeader>
            <RatingDialogMain>
                <RatingButtonContainer>
                    <div>
                        <RatingIconButton onClick={onSetPositiveRating} selected={ratingValue === 10}>
                            <ThumbIcon />
                        </RatingIconButton>
                    </div>
                    <div>
                        <RatingIconButton onClick={onSetNegativeRating} selected={ratingValue === 0}>
                            <ThumbDownIcon />
                        </RatingIconButton>
                    </div>
                </RatingButtonContainer>
                <div>
                    <div>{ratingCommentText}</div>
                </div>
            </RatingDialogMain>
            <RatingToolbar>
                <RatingInput
                    type="text"
                    value={ratingText}
                    onChange={onSetRatingText}
                    autoFocus
                    maxlength={500}
                    rows={3}
                />
                <IconButton
                    className={disableSendButton ? "disabled" : "active"}
                    disabled={disableSendButton}
                    onClick={onSendRating}
                >
                    <SendIcon />
                </IconButton>
            </RatingToolbar>
        </RatingDialogRoot>
    </Wrapper>
);