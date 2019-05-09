import { Options } from "@cognigy/webchat-client";

export const getOptionsKey = ({ userId, sessionId, channel }: Pick<Options, 'channel' | 'userId' | 'sessionId'>) => 
    JSON.stringify([channel, userId, sessionId]);