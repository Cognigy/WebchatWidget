import { Reducer } from "redux";

export interface RatingState {
	ratingGiven: boolean;
	showRatingDialog: boolean;
}

const SHOW_RATING_DIALOG = "SHOW_RATING_DIALOG";
export const showRatingDialog = (show: boolean) => ({
	type: SHOW_RATING_DIALOG as "SHOW_RATING_DIALOG",
	show
});
type ShowRatingDialogAction = ReturnType<typeof showRatingDialog>;

const SET_RATING_GIVEN = "SET_RATING_GIVEN";
export const setRatingGiven = () => ({
	type: SET_RATING_GIVEN as "SET_RATING_GIVEN",
});
type SetRatingGiven = ReturnType<typeof setRatingGiven>;

const getInitialState = (): RatingState => ({
	ratingGiven: false,
	showRatingDialog: false,
});

type RatingAction = ShowRatingDialogAction
	| SetRatingGiven;


export const rating: Reducer<RatingState, RatingAction> = (state = getInitialState(), action) => {
	switch (action.type) {
		case SHOW_RATING_DIALOG: {
			return {
				...state,
				showRatingDialog: action.show
			}
		}

		case SET_RATING_GIVEN: {
			return {
				...state,
				ratingGiven: true,
			}
		}
	}

	return state;
}