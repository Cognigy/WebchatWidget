import { IWebchatSettings } from "../../common/interfaces/webchat-config";

export const isHiddenDueToMaintenance = (settings: IWebchatSettings) => {
    if(settings.maintenanceEnabled && settings.maintenanceMode === "hide"){
        return true;
    }
    return false;
}

export const isDisabledDueToMaintenance = (settings: IWebchatSettings) => {
    if(settings.maintenanceEnabled && settings.maintenanceMode === "disable"){
        return true;
    }
    return false;
}