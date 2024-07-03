export interface IMessageEvent {
  text?: string;
  source?: string;
  timestamp?: number;
  data: {
    _cognigy: {
      _webchat3: TWebchat3Event;
    }
  }
}

export interface IQueueUpdateEvent {
	type: "queueUpdate";
  payload: {
    position: number | null;
    estimatedWaitTime: number | null;
    alternativeText: string | null;
  }
}

export interface ILiveAgentEvent {
	type: "liveAgentEvent";
  payload: {
    text?: string;
    action?: string;
    agentName?: string;
  }
}

export type TWebchat3Event = IQueueUpdateEvent | ILiveAgentEvent;