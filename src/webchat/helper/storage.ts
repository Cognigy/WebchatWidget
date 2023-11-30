import { IWebchatSettings } from "../../common/interfaces/webchat-config";
import { isValidJSON } from "../../webchat-ui/utils/isValidJSON";

/**
 * Returns the browser storage that should be used for this Webchat Embedding.
 *
 * Note that for restricted environments, even a read-access to `window.localStorage`
 * can result in an Error to throw, so we're first looking at the setting before accessing
 * either of those.
 */
export const getStorage = (
	settings: Pick<IWebchatSettings, "disableLocalStorage" | "useSessionStorage">,
) => {
	if (settings.disableLocalStorage) return null;

	if (settings.useSessionStorage) return window.sessionStorage;

	return window.localStorage;
};

export const getAllConversationsByUserID = (storage: Storage, currentUserId: string) => {
    return Object.keys(storage).reduce((obj, k) => {
        const data = storage.getItem(k) || "";

		// skip if not JSON
        if (!isValidJSON(k) || !isValidJSON(data)) return obj;
        
        const sessionId = JSON.parse(k)?.[2] || "";
        const userId = JSON.parse(k)?.[1] || "";

		// skip different userID
		if (currentUserId !== userId) return obj;

		// skip missing SessionID
        if (!sessionId) return obj;

        const messages = JSON.parse(data)?.messages;
		
		// skip empty
		if (!Array.isArray(messages) || messages.length === 0) return obj;

		return { ...obj, [sessionId]: JSON.parse(data)};
	}, {});
};
