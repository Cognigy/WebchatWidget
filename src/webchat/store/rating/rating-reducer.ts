import { Reducer } from "redux";

export interface RatingState {
    hasGivenRating: boolean;
    showRatingScreen: boolean;
    requestRatingScreenTitle?: string;
    customRatingTitle: string;
    customRatingCommentText: string;
    requestRatingSubmitButtonText?: string;
    requestRatingEventBannerText?: string;
    requestRatingChatStatusBadgeText?: string;
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

const SET_REQUEST_RATING_SCREEN_TITLE = "SET_REQUEST_RATING_SCREEN_TITLE";
export const setRequestRatingScreenTitle = (text: string) => ({
    type: SET_REQUEST_RATING_SCREEN_TITLE as "SET_REQUEST_RATING_SCREEN_TITLE",
    text,
});
type SetRequestRatingScreenTitle = ReturnType<typeof setRequestRatingScreenTitle>;

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

const SET_REQUEST_RATING_SUBMIT_BUTTON_TEXT = "SET_REQUEST_RATING_SUBMIT_BUTTON_TEXT";
export const setRequestRatingSubmitButtonText = (text: string) => ({
    type: SET_REQUEST_RATING_SUBMIT_BUTTON_TEXT as "SET_REQUEST_RATING_SUBMIT_BUTTON_TEXT",
    text,
});
type SetRequestRatingSubmitButtonText = ReturnType<typeof setRequestRatingSubmitButtonText>;

const SET_REQUEST_RATING_EVENT_BANNER_TEXT = "SET_REQUEST_RATING_EVENT_BANNER_TEXT";
export const setRequestRatingEventBannerText = (text: string) => ({
    type: SET_REQUEST_RATING_EVENT_BANNER_TEXT as "SET_REQUEST_RATING_EVENT_BANNER_TEXT",
    text,
});
type SetRequestRatingEventBannerText = ReturnType<typeof setRequestRatingEventBannerText>;

const SET_REQUEST_RATING_CHAT_STATUS_BADGE_TEXT = "SET_REQUEST_RATING_CHAT_STATUS_BADGE_TEXT";
export const setRequestRatingChatStatusText = (text: string) => ({
    type: SET_REQUEST_RATING_CHAT_STATUS_BADGE_TEXT as "SET_REQUEST_RATING_CHAT_STATUS_BADGE_TEXT",
    text,
});
type SetRequestRatingChatStatusText = ReturnType<typeof setRequestRatingChatStatusText>;

const getInitialState = (): RatingState => ({
    hasGivenRating: false,
    showRatingScreen: false,
    requestRatingScreenTitle: "",
    customRatingTitle: "",
    customRatingCommentText: "",
    requestRatingSubmitButtonText: "",
    requestRatingEventBannerText: "",
    requestRatingChatStatusBadgeText: "",
});

export const ratingInitialState = getInitialState();

export type RatingAction = ShowRatingScreenAction
    | SetHasGivenRating
    | SetRequestRatingScreenTitle
    | SetCustomRatingTitle
    | SetCustomRatingCommentText
    | SetRequestRatingSubmitButtonText
    | SetRequestRatingEventBannerText
    | SetRequestRatingChatStatusText;


export const rating: Reducer<RatingState, RatingAction> = (state = getInitialState(), action) => {
    switch (action.type) {
        case SHOW_RATING_SCREEN: {

            // reset custom texts when the rating screen is closed
            if (action.show === false) {
                return {
                    ...state,
                    showRatingScreen: action.show,
                    requestRatingScreenTitle: "",
                    customRatingTitle: "",
                    customRatingCommentText: "",
                    requestRatingSubmitButtonText: "",
                    requestRatingEventBannerText: "",
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

        case SET_REQUEST_RATING_SCREEN_TITLE: {
            return {
                ...state,
                requestRatingScreenTitle: action.text,
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

        case SET_REQUEST_RATING_SUBMIT_BUTTON_TEXT: {
            return {
                ...state,
                requestRatingSubmitButtonText: action.text,
            }
        }

        case SET_REQUEST_RATING_EVENT_BANNER_TEXT: {
            return {
                ...state,
                requestRatingEventBannerText: action.text,
            }
        }

        case SET_REQUEST_RATING_CHAT_STATUS_BADGE_TEXT: {
            return {
                ...state,
                requestRatingChatStatusBadgeText: action.text,
            }
        }

    }

    return state;
}