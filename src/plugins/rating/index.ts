import { registerMessagePlugin } from "../helper";
import { MessagePlugin } from "../../common/interfaces/message-plugin";
import { IMessage } from "../../common/interfaces/message";
import RatingConfirmation from "./RatingConfirmation";

interface IRating {
  rating: number;
  comment?: string;
}

export const getRating = (message: IMessage): IRating | null => {
  const { source, data } = message;

  // Show feedback submitted pill in chat only if showRatingStatus is true
  if (
    source === "user" &&
    data?._cognigy?.controlCommands?.[0]?.type === "setRating" &&
    data?._cognigy?.controlCommands?.[0]?.parameters?.showRatingStatus === true
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
  component: RatingConfirmation,
  options: {
    fullwidth: true,
  },
};

registerMessagePlugin(ratingMessagePlugin);

export default ratingMessagePlugin;
