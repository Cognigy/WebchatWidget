import { IWebchatSettings } from "../../common/interfaces/webchat-config";

export const isHiddenDueToConnectivity = (settings: IWebchatSettings, timedOut: boolean) => {
    if(settings.connectivity?.enabled && settings.connectivity?.mode === "hide" && timedOut){
        return true;
    }
    return false;
}

export const isDisabledDueToConnectivity = (settings: IWebchatSettings, timedOut: boolean) => {
    if(settings.connectivity?.enabled && settings.connectivity?.mode === "disable" && timedOut){
        return true;
    }
    return false;
}

export const isInformingDueToConnectivity = (settings: IWebchatSettings, timedOut: boolean) => {
    if(settings.connectivity?.enabled && settings.connectivity?.mode === "inform" && timedOut){
        return true;
    }
    return false;
}