
import { registerMessagePlugin } from "../helper";
import { MessagePlugin } from "../../common/interfaces/message-plugin";
import RatingHistoryEntry from "./RatingHistoryEntry";

const ratingMessagePlugin: MessagePlugin = {
    match: ({ source, data }) => {
        if (source === 'user' && data?._cognigy?.controlCommands?.[0]?.type === "setRating") {
            return true;
        }

        return false;
    },
    component: RatingHistoryEntry,
    options: {
        fullwidth: true,
    },
};

registerMessagePlugin(ratingMessagePlugin);

export default ratingMessagePlugin;