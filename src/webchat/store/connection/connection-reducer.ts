import { Reducer } from "redux";

export interface ConnectionState {
    connected: boolean;
}

const initialState: ConnectionState = {
    connected: false
}

export const SET_CONNECTED = 'SET_CONNECTED'
export const setConnected = (connected: boolean) => ({
    type: SET_CONNECTED as 'SET_CONNECTED',
    connected
});
export type SetConnectedAction = ReturnType<typeof setConnected>;

export const connection: Reducer<ConnectionState, SetConnectedAction> = (state: ConnectionState = initialState, action: SetConnectedAction) => {
    switch (action.type) {
        case 'SET_CONNECTED': {
            return {
                connected: action.connected
            }
        }
    }

    return state;
} 