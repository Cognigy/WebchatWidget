import { Reducer } from "redux";

export interface RatingState {
	hasGivenRating: boolean;
	showRatingDialog: boolean;
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

const getInitialState = (): RatingState => ({
	hasGivenRating: false,
	showRatingDialog: false,
});

type RatingAction = ShowRatingDialogAction
	| SetHasGivenRating;


export const rating: Reducer<RatingState, RatingAction> = (state = getInitialState(), action) => {
	switch (action.type) {
		case SHOW_RATING_DIALOG: {
			return {
				...state,
				showRatingDialog: action.show
			}
		}

		case SET_HAS_GIVEN_RATING: {
			return {
				...state,
				hasGivenRating: true,
			}
		}
	}

	return state;
}