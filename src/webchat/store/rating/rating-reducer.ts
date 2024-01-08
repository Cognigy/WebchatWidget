import { Reducer } from "redux";

export interface RatingState {
    hasGivenRating: boolean;
    showRatingScreen: boolean;
    customRatingTitle: string;
    customRatingCommentText: string;
}

const SHOW_RATING_SCREEN = "SHOW_RATING_SCREEN";
export const showRatingScreen = (show: boolean) => ({
    type: SHOW_RATING_SCREEN as "SHOW_RATING_SCREEN",
    show
});
type ShowRatingScreenAction = ReturnType<typeof showRatingScreen>;

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
    showRatingScreen: false,
    customRatingTitle: "",
    customRatingCommentText: "",
});

export const ratingInitialState = getInitialState();

export type RatingAction = ShowRatingScreenAction
    | SetHasGivenRating
    | SetCustomRatingTitle
    | SetCustomRatingCommentText;


export const rating: Reducer<RatingState, RatingAction> = (state = getInitialState(), action) => {
    switch (action.type) {
        case SHOW_RATING_SCREEN: {

            // reset custom texts when the rating screen is closed
            if (action.show === false) {
                return {
                    ...state,
                    showRatingScreen: action.show,
                    customRatingTitle: "",
                    customRatingCommentText: "",
                }

            } else {
                return {
                    ...state,
                    showRatingScreen: action.show
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