import { FC, useEffect } from "react";
import { addMessage } from "../../../webchat/store/messages/message-reducer";
import { useDispatch } from "react-redux";

const XAppSubmitObserver: FC = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		function onXAppSubmit(event: MessageEvent) {
			const { data } = event;

			if (event.data.type !== "x-app-submit") {
				return;
			}

			const { success = false } = data || {};

			dispatch(
				addMessage({
					source: "user",
					data: {
						_plugin: {
							type: "x-app-submit",
							data: {
								success,
							},
						},
					},
				}),
			);
		}

		window.addEventListener("message", onXAppSubmit);

		return () => {
			window.removeEventListener("message", onXAppSubmit);
		};
	}, []);

	return null;
};

export default XAppSubmitObserver;
