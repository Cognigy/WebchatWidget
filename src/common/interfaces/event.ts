import { TWebchat3Event } from "@cognigy/socket-client";

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