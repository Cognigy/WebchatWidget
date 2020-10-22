import { Reducer } from "redux";
import { Options } from "@cognigy/socket-client/lib/interfaces/options";

export type OptionsState = Pick<Options, 'userId' | 'sessionId' | 'channel'>;

const getInitialState = (): OptionsState => ({
    channel: '',
    sessionId: '',
    userId: ''
});

const SET_OPTIONS = 'SET_OPTIONS';
export const setOptions = (options: Options) => ({
    type: SET_OPTIONS as 'SET_OPTIONS',
    options
});
export type SetOptionsAction = ReturnType<typeof setOptions>;

export const options: Reducer<OptionsState, SetOptionsAction> = (state = getInitialState(), action) => {
    switch (action.type) {
        case 'SET_OPTIONS': {
            return action.options;
        };

        default:
            return state;
    };
};
