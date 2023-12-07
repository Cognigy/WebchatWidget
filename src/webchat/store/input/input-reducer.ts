import { Reducer } from "redux";

export interface IInputState {
    sttActive: boolean;
}

const SET_STT_ACTIVE = "SET_STT_ACTIVE";
export const setSTTActive = (active: boolean) => ({
    type: SET_STT_ACTIVE as "SET_STT_ACTIVE",
    active,
});
type TSetSTTActiveAction = ReturnType<typeof setSTTActive>;

const getInitialState = (): IInputState => ({
    sttActive: false,
});

type InputAction = TSetSTTActiveAction;


export const input: Reducer<IInputState, InputAction> = (state = getInitialState(), action) => {
    switch (action.type) {
        case SET_STT_ACTIVE: {
            return {
                ...state,
                sttActive: action.active,
            }
        }

        default: {
            return state;
        }
    }
}