import { Reducer } from "redux";

export interface ConnectionState {
    connected: boolean;
    reconnectionLimit: boolean;
}

const initialState: ConnectionState = {
    connected: false,
    reconnectionLimit: false,
}

export const SET_CONNECTED = 'SET_CONNECTED'
export const setConnected = (connected: boolean) => ({
    type: SET_CONNECTED as 'SET_CONNECTED',
    connected
});

export const SET_RECONNECTION_LIMIT = 'SET_RECONNECTION_LIMIT'
export const setReconnectionLimit = (reconnectionLimit: boolean) => ({
    type: SET_RECONNECTION_LIMIT as 'SET_RECONNECTION_LIMIT',
    reconnectionLimit
});

export type SetConnectedAction = ReturnType<typeof setConnected>;
export type SetReconnectionLimitAction = ReturnType<typeof setReconnectionLimit>;

export const connection: Reducer<ConnectionState, SetConnectedAction | SetReconnectionLimitAction> = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CONNECTED': {
            return {
                ...state,
                connected: action.connected
            }
        }
        case 'SET_RECONNECTION_LIMIT': {
            return {
                ...state,
                reconnectionLimit: action.reconnectionLimit
            }
        }
        default: {
            return state;
        }
    }
} 
