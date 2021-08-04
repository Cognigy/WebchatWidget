import { Reducer } from "redux";

export interface RatingState {
	ratingGiven: boolean;
	showRatingDialog: boolean;
	ratingValue: number | null;
	ratingText: string;
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

const SET_RATING_TEXT = "SET_RATING_TEXT";
export const setRatingText = (text: string) => ({
	type: SET_RATING_TEXT as "SET_RATING_TEXT",
	text,
});
type SetRatingText = ReturnType<typeof setRatingText>;

const SET_RATING_VALUE = "SET_RATING_VALUE";
export const setRatingValue = (value: number | null) => ({
	type: SET_RATING_VALUE as "SET_RATING_VALUE",
	value,
});
type SetRatingValue = ReturnType<typeof setRatingValue>;

const getInitialState = (): RatingState => ({
	ratingGiven: false,
	showRatingDialog: false,
	ratingValue: null,
	ratingText: "",
});

type RatingAction = ShowRatingDialogAction
	| SetRatingGiven
	| SetRatingText
	| SetRatingValue;


export const rating: Reducer<RatingState, RatingAction> = (state = getInitialState(), action) => {
	switch (action.type) {
		case SHOW_RATING_DIALOG: {
			if (action.show === false) {
				return {
					...state,
					showRatingDialog: action.show,
					ratingValue: null,
					ratingText: "",
				}
			}
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

		case SET_RATING_TEXT: {
			return {
				...state,
				ratingText: action.text,
			}
		}

		case SET_RATING_VALUE: {
			return {
				...state,
				ratingValue: action.value,
			}
		}
	}

	return state;
}