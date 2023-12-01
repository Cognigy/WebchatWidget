import React, { FC } from "react";
import { useTheme } from "@emotion/react";
import toast, { ToastOptions, Toaster } from "react-hot-toast";

const Notifications: FC = () => {
	const theme = useTheme();

	return (
		<Toaster
			gutter={1}
			toastOptions={{
				duration: 1500,
				style: {
					backgroundColor: theme.green10,
					borderRadius: 0,
					boxShadow: "none",
					color: theme.green,
					fontFamily: theme.fontFamily,
					fontSize: 14,
					fontWeight: 600,
					lineHeight: 1.3,
					maxWidth: "unset",
					paddingBlock: 16,
					paddingInlineStart: 20,
					width: "100%",
				},
			}}
			containerStyle={{
				left: 0,
				position: "relative",
				right: 0,
				top: 0,
				width: "100%",
			}}
		></Toaster>
	);
};

type MessageType = Parameters<typeof toast>[0];

export function createNotification(message: MessageType, options: ToastOptions = {}) {
	toast(message, options);
}

/**
 * Creates a persistent notification.
 * Can be dismissed by calling the returned function.
 *
 * usage example:
 *
 * const dismiss = createPersistentNotification("Hello World!");
 * setTimeout(dismiss, 5000);
 */
export function createPersistentNotification(message: MessageType, options: ToastOptions = {}) {
	const id = toast(message, { ...options, duration: Infinity });

	return () => toast.dismiss(id);
}

export default Notifications;
