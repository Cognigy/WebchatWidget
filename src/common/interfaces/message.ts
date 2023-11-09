export interface IBaseMessage {
    text?: string;
    data?: any;
    source: string;
    avatarUrl?: string;
    avatarName?: string;
    timestamp?: number;
}

export interface IUserMessage extends IBaseMessage {
    source: 'user';
}

export interface IBotMessage extends IBaseMessage {
    source: 'bot';
    traceId: string;
}

export interface IAgentMessage extends IBaseMessage {
    source: 'agent';
    traceId: string;
}

export interface IEngagementMessage extends IBaseMessage {
    source: 'engagement';
    traceId: string;
}

export type IMessage = IUserMessage | IBotMessage | IAgentMessage | IEngagementMessage;