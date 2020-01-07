import l10n from "./langHelper";
import { isWeekend } from "date-fns";
import {
  localeStringFormat,
  langCodeToLocale,
  parseDateString
} from "./dateHelper";

export const makeFlatpickrConfig = data => {

  const localeId = data.locale || "us";
  const flatpickrLocale = l10n[localeId];
  const formatLocale = langCodeToLocale(localeId);

  const enableTime = data.enableTime;

  const filterDates = data.enable_disable || [];

  const outputFormat = localeStringFormat(enableTime);

  const options = {
    disable: [] as Array<Date | ((date: string) => boolean)>,
    enable: [] as Array<Date | ((date: string) => boolean)>,
    enableTime,
    event: data.eventName || "Pick a date",
    inline: true,
    locale: flatpickrLocale,
    maxDate: parseDateString(data.maxDate) || "",
    minDate: parseDateString(data.minDate) || "",
    mode: data.mode || "single",
    static: true,
    time_24hr: data.time_24hr || false,
    formatDate: date =>
      new Date(date).toLocaleString(formatLocale, outputFormat)
  };

  const mask: Array<Date | ((date: string) => boolean)> = [...filterDates].map(
    date => {
      if (date === "weekends") return isWeekend;
      return parseDateString(date);
    }
  );

  if (data.wantDisable) options.disable = mask;
  else options.enable = mask;

  return options;
};
