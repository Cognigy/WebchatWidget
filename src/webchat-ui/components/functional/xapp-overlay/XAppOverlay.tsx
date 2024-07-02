import { useDispatch } from "react-redux";
import React, { FC, useEffect } from "react";
import styled from "@emotion/styled";

import { addMessage } from "../../../../webchat/store/messages/message-reducer";
import { closeOverlay } from "../../../../webchat/store/xapp-overlay/slice";
import { useOverlaySettingsByUrl } from "../../../../webchat/store/xapp-overlay/hooks";
import { useSelector } from "../../../../webchat/helper/useSelector";
import Header from "../../presentational/Header";
import { sendMessage } from "../../../../webchat/store/messages/message-middleware";

const Root = styled.div(() => ({
	display: "flex",
	flexDirection: "column",
	height: "100%",
	width: "100%",
	animation: "fade-in-xapp .25s ease-out",
	"@keyframes fade-in-xapp": {
		from: {
			transform: "scale(.875)",
			opacity: 0.25,
		},
		to: {
			transform: "scale(1)",
			opacity: 1,
		},
	},
}));

const Iframe = styled.iframe(() => ({
	appearance: "none",
	border: "none",
	height: "100%",
	width: "100%",
	animation: "fade-in-xapp-2 .325s ease-in",
	"@keyframes fade-in-xapp-2": {
		from: {
			opacity: 0.87,
			transform: "scale(.95)",
			translateY: "-300px",
		},
		to: {
			transform: "scale(1)",
			translateY: 0,
			opacity: 1,
		},
	},
}));

const xAppOverlay: FC = () => {
	const url = useSelector(state => state.xAppOverlay.currentUrl) || "";
	const {
		closeOnSubmit,
		feedbackMessage,
		screenTitle,
		sendEventOnCloseIconClick,
		showCloseIcon,
	} = useOverlaySettingsByUrl(url);

	const dispatch = useDispatch();

	const handleClose = () => {
		if (closeOnSubmit) {
			dispatch(closeOverlay());
		}
	};

	const handleCloseIconClick = () => {
		if (sendEventOnCloseIconClick) {
			dispatch(sendMessage({ data: { type: "xAppClosed" } }));
		}

		dispatch(closeOverlay());
	};

	const handleSubmit = (event: MessageEvent) => {
		if (url.startsWith(event.origin) === false) {
			return;
		}

		if (event.data.type !== "x-app-submit") {
			return;
		}

		if (feedbackMessage) {
			const { success = false } = event?.data || {};

			dispatch(
				addMessage({
					source: "user",
					data: {
						_plugin: {
							type: "x-app-submit",
							data: {
								success,
								text: feedbackMessage,
							},
						},
					},
				}),
			);
		}

		handleClose();
	};

	// We revieve a MessageEvent from the xApp iframe when submission happens
	// https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent
	useEffect(() => {
		function unsubscribe() {
			window.removeEventListener("message", handleSubmit);
		}

		window.addEventListener("message", handleSubmit);

		return () => {
			unsubscribe();
		};
	}, [closeOnSubmit]);

	const showHeader = screenTitle || showCloseIcon;

	return (
		<Root tabIndex={0} role="dialog" aria-modal="true">
			{showHeader && (
				<Header
					title={screenTitle}
					hideBackButton
					onClose={showCloseIcon ? handleCloseIconClick : undefined}
				/>
			)}
			<Iframe
				src={url}
				allow="
  accelerometer; ambient-light-sensor; autoplay; battery; bluetooth; camera; 
  cross-origin-isolated; display-capture; document-domain; encrypted-media; 
  execution-while-not-rendered; execution-while-out-of-viewport; 
  fullscreen; gamepad; geolocation; gyroscope; hid; idle-detection; 
  interest-cohort; local-fonts; magnetometer; microphone; midi; 
  otp-credentials; payment; picture-in-picture; publickey-credentials-get; 
  screen-wake-lock; serial; speaker-selection; usb; web-share; 
  xr-spatial-tracking"
			/>
		</Root>
	);
};

export default xAppOverlay;
