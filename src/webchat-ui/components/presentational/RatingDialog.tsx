import * as React from 'react';
import { styled } from "../../style";
import Input from './Input';
import Toolbar from './Toolbar';
import IconButton from './IconButton';
import SendIcon from '../plugins/input/text/baseline-send-24px.svg';
import CloseIcon from "../../assets/baseline-close-24px.svg";

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

const RatingDialogHeader = styled.div({
    display: "flex",
    justifyContent: "flex-end",
});

const RatingDialogMain = styled.div({
    height: 250,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
});

const RatingToolbar = styled(Toolbar)(({ theme }) => ({
}));

const RatingInput = styled(Input)(({ theme }) => ({
    borderColor: theme.primaryWeakColor,
}));

export default ({ currentRating, ...props }) => (
    <Wrapper>
        <RatingDialogRoot>
            <RatingDialogHeader>
                <IconButton>
                    <CloseIcon />
                </IconButton>
            </RatingDialogHeader>
            <RatingDialogMain>
                <div>Thank you for your feedback!</div>
                <div>Feel free to leave a comment.</div>
            </RatingDialogMain>
            <RatingToolbar>
                <RatingInput />
                <IconButton>
                    <SendIcon />
                </IconButton>
            </RatingToolbar>
        </RatingDialogRoot>
    </Wrapper>
);