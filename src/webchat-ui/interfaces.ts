import { ISendMessageOptions } from "../webchat/store/messages/message-middleware";

export type MessageSender = (
  text?: string,
  data?: any,
  options?: Partial<ISendMessageOptions>
) => void;
