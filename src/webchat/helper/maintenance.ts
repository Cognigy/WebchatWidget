import { IWebchatSettings } from "../../common/interfaces/webchat-config";

export const isHiddenDueToMaintenance = (settings: IWebchatSettings) => {
    if(settings.maintenance?.enabled && settings.maintenance?.mode === "hide"){
        return true;
    }
    return false;
}

export const isDisabledDueToMaintenance = (settings: IWebchatSettings) => {
    if(settings.maintenance?.enabled && settings.maintenance?.mode === "disable"){
        return true;
    }
    return false;
}

export const isInformingDueToMaintenance = (settings: IWebchatSettings) => {
    if(settings.maintenance?.enabled && settings.maintenance?.mode === "inform"){
        return true;
    }
    return false;
}