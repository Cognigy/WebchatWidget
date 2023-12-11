import { Options } from "@cognigy/socket-client/lib/interfaces/options";
import { IWebchatConfig } from "../../../common/interfaces/webchat-config";

export const getOptionsKey = (
	{ userId, sessionId, channel }: Pick<Options, "channel" | "userId" | "sessionId">,
	{ URLToken }: Pick<IWebchatConfig, "URLToken">,
) => JSON.stringify([channel, userId, sessionId, URLToken]);
