import { createSlice } from "@reduxjs/toolkit";

import type { ReceiveMessageAction } from "../messages/message-handler";
import { isXAppOverlayMessage } from "./utils";

const defaultOverlaySettings = {
	autoOpen: true,
	closeOnSubmit: true,
	feedbackMessage: null,
	screenTitle: "",
	sendEventOnCloseIconClick: false,
	showCloseIcon: true,
};

const xAppOverlay = createSlice({
	name: "xAppOverlay",
	initialState: {
		open: false,
		currentUrl: null,

		// KV store for xApp overlay settings.
		// Keys are xApp URLs, values are objects with xApp Overlay Settings.
		settingsByUrl: {} as Record<string, typeof defaultOverlaySettings>,
	},
	reducers: {
		openOverlay(state, action) {
			state.open = true;
			state.currentUrl = action.payload;
		},
		closeOverlay(state) {
			state.open = false;
			state.currentUrl = null;
		},
	},
	extraReducers(builder) {
		builder.addCase("RECEIVE_MESSAGE", (state, action: ReceiveMessageAction) => {
			const { message } = action;

			if (isXAppOverlayMessage(message)) {
				const key = message.data._cognigy._app.url;

				if (!key) {
					console.error("xApp Overlay message received without an URL");
					return;
				}

				if (message.data._cognigy._app.overlaySettings.autoOpen) {
					state.open = true;
					state.currentUrl = key;
				}

				state.settingsByUrl[key] = {
					...defaultOverlaySettings,
					...message.data._cognigy._app.overlaySettings,
				};
			}
		});
	},
});

export const { openOverlay, closeOverlay } = xAppOverlay.actions;
export default xAppOverlay.reducer;
