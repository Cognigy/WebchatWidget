export interface IBaseMessage {
	avatarName?: string;
	avatarUrl?: string;
	data?: any;
	isLast?: boolean;
	prevMessage?: IMessage;
	source: string;
	text?: string;
	timestamp?: number;
}

export interface IUserMessage extends IBaseMessage {
	source: "user";
}

export interface IBotMessage extends IBaseMessage {
	source: "bot";
	traceId: string;
}

export interface IAgentMessage extends IBaseMessage {
	source: "agent";
	traceId: string;
}

export interface IEngagementMessage extends IBaseMessage {
	source: "engagement";
	traceId: string;
}

export type IMessage = IUserMessage | IBotMessage | IAgentMessage | IEngagementMessage;
