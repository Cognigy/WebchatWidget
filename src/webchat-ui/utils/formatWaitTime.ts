// used on Queue Updates
export const formatWaitTime = (ms: number | null) => {
  if (!ms) return "";
  const seconds = ms / 1000;

  const getMinutes = (minutes: number) => {
    return `${minutes} ${minutes > 1 ? "minutes" : "minute"}`;
  };

  if (seconds < 60) {
    return `${seconds} seconds`;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return getMinutes(minutes);
  }

  const hours = Math.floor(seconds / 3600);
  const restMinutes = minutes - hours * 60;

  return `${hours} ${hours > 1 ? "hours" : "hour"}${
    restMinutes > 0 ? ` and ${getMinutes(restMinutes)}` : ""
  }`;
};