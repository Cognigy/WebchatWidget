export interface IMessageEvent {
  text?: string;
  source?: string;
  timestamp?: number;
  data: {
    _cognigy: {
      _webchat3Event: TWebchat3Event;
    }
  }
}

export interface IQueueUpdateEvent {
	type: "queueUpdate";
  data: {
    position: number | null;
    estimatedWaitTime: number | null;
    alternativeText: string | null;
  }
}

export interface ILiveAgentEvent {
	type: "liveAgentEvent";
  data: {
    text?: string;
    action: string;
    agentName: string;
  }
}

export type TWebchat3Event = IQueueUpdateEvent | ILiveAgentEvent;