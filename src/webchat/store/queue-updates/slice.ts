import { createSlice } from "@reduxjs/toolkit";
import type { ReceiveMessageAction } from "../messages/message-handler";

export interface IQueueUpdateState {
	isQueueActive: boolean;
	position: number | null;
	estimatedWaitTime: number | null;
	alternativeText: string | null;
}

const initialState: IQueueUpdateState = {
	isQueueActive: false,
	position: null,
	estimatedWaitTime: null,
	alternativeText: null,
};

const queueUpdates = createSlice({
	name: "queueUpdates",
	initialState,
	reducers: {
		updateQueueData(state, action) {
			state.isQueueActive = true;
			state.position = action.payload?.position || null;
			state.estimatedWaitTime = action.payload?.estimatedWaitTime || null;
			state.alternativeText = action.payload?.alternativeText || null;
		},
		resetQueueData: () => initialState,
	},
	extraReducers(builder) {
		builder.addCase("RECEIVE_MESSAGE", (state, action: ReceiveMessageAction) => {
			const { message } = action;

			// temporary solution until we will get real agent status updates
			if (message?.source === "agent") {
				return initialState;
			}
		});
	},
});

export const { updateQueueData, resetQueueData } = queueUpdates.actions;
export default queueUpdates.reducer;
