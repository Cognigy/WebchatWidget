import { IWebchatSettings } from "../../common/interfaces/webchat-config";

export const isHiddenDueToConnectivity = (settings: IWebchatSettings, timedOut: boolean) => {
	if (settings.embeddingConfiguration?.connectivity?.enabled && settings.embeddingConfiguration?.connectivity?.mode === "hide" && timedOut) {
        return true;
    }
    return false;
}

export const isDisabledDueToConnectivity = (settings: IWebchatSettings, timedOut: boolean) => {
	if (settings.embeddingConfiguration?.connectivity?.enabled && settings.embeddingConfiguration?.connectivity?.mode === "disable" && timedOut) {
        return true;
    }
    return false;
}

export const isInformingDueToConnectivity = (settings: IWebchatSettings, timedOut: boolean) => {
	if (settings.embeddingConfiguration?.connectivity?.enabled && settings.embeddingConfiguration?.connectivity?.mode === "inform" && timedOut) {
        return true;
    }
    return false;
}