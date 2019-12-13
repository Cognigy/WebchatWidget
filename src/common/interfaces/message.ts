export interface IBaseMessage {
    text?: string;
    data?: any;
    source: string;
    avatarUrl?: string;
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

export type IMessage = IUserMessage | IBotMessage | IAgentMessage;