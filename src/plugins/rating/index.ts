import { registerMessagePlugin } from "../helper";
import { MessagePlugin } from "../../common/interfaces/message-plugin";

export const getRating = () => {
  return null;
};

const ratingMessagePlugin: MessagePlugin = {
  match: () => !!getRating(),
  component: () => null,
  options: {
    fullwidth: true,
  },
};

registerMessagePlugin(ratingMessagePlugin);

export default ratingMessagePlugin;
