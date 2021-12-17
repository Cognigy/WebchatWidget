import { IWebchatSettings } from "../../common/interfaces/webchat-config";

/**
 * Returns the browser storage that should be used for this Webchat Embedding.
 * 
 * Note that for restricted environments, even a read-access to `window.localStorage`
 * can result in an Error to throw, so we're first looking at the setting before accessing
 * either of those.
 */
export const getStorage = (settings: Pick<IWebchatSettings, "disableLocalStorage" | "useSessionStorage">) => {
    if (settings.disableLocalStorage)
        return null;

    if (settings.useSessionStorage)
        return window.sessionStorage;

    return window.localStorage;
}