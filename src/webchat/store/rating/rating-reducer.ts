import { Reducer } from "redux";

export interface RatingState {
    hasGivenRating: boolean;
    showRatingDialog: boolean;
    customRatingTitle: string;
    customRatingCommentText: string;
}

const SHOW_RATING_DIALOG = "SHOW_RATING_DIALOG";
export const showRatingDialog = (show: boolean) => ({
    type: SHOW_RATING_DIALOG as "SHOW_RATING_DIALOG",
    show
});
type ShowRatingDialogAction = ReturnType<typeof showRatingDialog>;

const SET_HAS_GIVEN_RATING = "SET_HAS_GIVEN_RATING";
export const setHasGivenRating = () => ({
    type: SET_HAS_GIVEN_RATING as "SET_HAS_GIVEN_RATING",
});
type SetHasGivenRating = ReturnType<typeof setHasGivenRating>;

const SET_CUSTOM_RATING_TITLE = "SET_CUSTOM_RATING_TITLE";
export const setCustomRatingTitle = (text: string) => ({
    type: SET_CUSTOM_RATING_TITLE as "SET_CUSTOM_RATING_TITLE",
    text,
});
type SetCustomRatingTitle = ReturnType<typeof setCustomRatingTitle>;

const SET_CUSTOM_RATING_COMMENT_TEXT = "SET_CUSTOM_RATING_COMMENT_TEXT";
export const setCustomRatingCommentText = (text: string) => ({
    type: SET_CUSTOM_RATING_COMMENT_TEXT as "SET_CUSTOM_RATING_COMMENT_TEXT",
    text,
});
type SetCustomRatingCommentText = ReturnType<typeof setCustomRatingCommentText>;

const getInitialState = (): RatingState => ({
    hasGivenRating: false,
    showRatingDialog: false,
    customRatingTitle: "",
    customRatingCommentText: "",
});

type RatingAction = ShowRatingDialogAction
    | SetHasGivenRating
    | SetCustomRatingTitle
    | SetCustomRatingCommentText;


export const rating: Reducer<RatingState, RatingAction> = (state = getInitialState(), action) => {
    switch (action.type) {
        case SHOW_RATING_DIALOG: {

            // reset custom texts when the rating dialog is closed
            if (action.show === false) {
                return {
                    ...state,
                    showRatingDialog: action.show,
                    customRatingTitle: "",
                    customRatingCommentText: "",
                }

            } else {
                return {
                    ...state,
                    showRatingDialog: action.show
                }
            }

        }

        case SET_HAS_GIVEN_RATING: {
            return {
                ...state,
                hasGivenRating: true,
            }
        }

        case SET_CUSTOM_RATING_TITLE: {
            return {
                ...state,
                customRatingTitle: action.text,
            }
        }

        case SET_CUSTOM_RATING_COMMENT_TEXT: {
            return {
                ...state,
                customRatingCommentText: action.text,
            }
        }
    }

    return state;
}