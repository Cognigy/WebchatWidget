import { addDays } from "date-fns";


// We expect the input to be an ISO Date string or one of the keywords:
// "today", "tomorrow", "yesterday"

export const parseDateString = (dateStr: string): Date => {

  const str = dateStr.toLowerCase();

  const today = new Date();
  const tomorrow = addDays(today, 1);
  const yesterday = addDays(today, -1);

  if (str === "today") return today;
  if (str === "tomorrow") return tomorrow;
  if (str === "yesterday") return yesterday;

  return new Date(dateStr);
};

type DateOutputFormatConfig = {
  year: string;
  month: string;
  day: string;
  hour?: string;
  minute?: string;
};

export const localeStringFormat = (
  withTime: boolean
): DateOutputFormatConfig => {
  let format: DateOutputFormatConfig = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  };

  if (withTime) {
    format = {
      ...format,
      hour: "2-digit",
      minute: "2-digit"
    };
  }

  return format;
};

export const langCodeToLocale = (locale: string): string => {
  switch (locale) {
    case "au":
      return "en-AU";
    case "ca":
      return "en-CA";
    case "gb":
      return "en-GB";
    case "us":
      return "en-US";
  }

  return locale;
};
