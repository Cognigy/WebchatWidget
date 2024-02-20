import { IWebchatSettings } from '../../common/interfaces/webchat-config';

export const isOutOfBusinessHours = (businessHours: IWebchatSettings['businessHours']): boolean => {

    if (businessHours && businessHours.enabled) {
        let outOfBusinessHours = true;
        const now = getLocalTime(businessHours.timeZone);
		const businessHoursToday = businessHours.times.filter((item) => { return item.weekDay === now.weekDay })
        for (let i = 0; i < businessHoursToday.length; i++) {
            const { 0: hourStart, 1: minuteStart } = businessHoursToday[i].startTime.split(":");
            const { 0: hourEnd, 1: minuteEnd } = businessHoursToday[i].endTime.split(":");
            if (parseInt(hourStart) < now.hour && now.hour < parseInt(hourEnd)) {
                outOfBusinessHours = false;
            } else if (parseInt(hourStart) === now.hour && now.minute >= parseInt(minuteStart) && now.hour < parseInt(hourEnd)) {
                outOfBusinessHours = false;
            } else if (parseInt(hourStart) === now.hour && now.minute >= parseInt(minuteStart) && now.hour === parseInt(hourEnd) && now.minute < parseInt(minuteEnd)) {
                outOfBusinessHours = false;
            } else if (parseInt(hourStart) < now.hour && now.hour === parseInt(hourEnd) && now.minute < parseInt(minuteEnd)) {
                outOfBusinessHours = false;
            }
        }
        return outOfBusinessHours;
    }
    return false;
}

const getLocalTime = (timeZone: string) => {
    const now = new Date().toLocaleString("en-US", { timeZone })
    const day = new Date(now).getDay();
    const hour = new Date(now).getHours();
    const minute = new Date(now).getMinutes();
    let weekDay;
    switch (day) {
        case 0:
            weekDay = "sunday";
            break;
        case 1:
            weekDay = "monday";
            break;
        case 2:
            weekDay = "tuesday";
            break;
        case 3:
            weekDay = "wednesday";
            break;
        case 4:
            weekDay = "thursday";
            break;
        case 5:
            weekDay = "friday";
            break;
        case 6:
            weekDay = "saturday";
            break;
    }
    return {
        weekDay,
        hour,
        minute
    }
}

export const isHiddenOutOfBusinessHours = (businessHours: IWebchatSettings['businessHours']): boolean => {
    if (isOutOfBusinessHours(businessHours) && businessHours.mode === "hide") {
        return true;
    }
    return false;
}

export const isDisabledOutOfBusinessHours = (businessHours: IWebchatSettings['businessHours']): boolean => {
    if (isOutOfBusinessHours(businessHours) && businessHours.mode === "disable") {
        return true;
    }
    return false;
}

export const isInformingOutOfBusinessHours = (businessHours: IWebchatSettings['businessHours']): boolean => {
    if (isOutOfBusinessHours(businessHours) && businessHours.mode === "inform") {
        return true;
    }
    return false;
}