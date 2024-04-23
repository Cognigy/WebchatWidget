export function isXAppOverlayMessage(message: IBotMessage): boolean {
	const hasOverlaySettings = message?.data?._cognigy?._app?.overlaySettings;
	const hasUrl = message?.data?._cognigy?._app?.url;

	return hasOverlaySettings && hasUrl;
}
