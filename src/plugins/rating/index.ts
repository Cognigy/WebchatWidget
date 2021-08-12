import { registerMessagePlugin } from "../helper";
import { MessagePlugin } from "../../common/interfaces/message-plugin";
import RatingHistoryEntry from "./RatingHistoryEntry";
import { IMessage } from "../../common/interfaces/message";

interface IRating {
  rating: number;
  comment?: string;
}

export const getRating = (message: IMessage): IRating | null => {
  const { source, data } = message;

  if (
    source === "user" &&
    data?._cognigy?.controlCommands?.[0]?.type === "setRating"
  ) {
    const { comment, rating } =
      message?.data?._cognigy?.controlCommands?.[0]?.parameters;

    return { comment, rating };
  }

  if ((message as any)?.rating !== undefined) {
    const { rating, ratingComment: comment } = message as any;

    return { rating, comment };
  }

  return null;
};

const ratingMessagePlugin: MessagePlugin = {
  match: (message) => !!getRating(message),
  component: RatingHistoryEntry,
  options: {
    fullwidth: true,
  },
};

registerMessagePlugin(ratingMessagePlugin);

export default ratingMessagePlugin;
