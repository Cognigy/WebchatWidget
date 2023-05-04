import { ISendMessageOptions } from "../webchat/store/messages/message-middleware";

export type MessageSender = (text?: string, data?: any, attachments?: any, options?: Partial<ISendMessageOptions>) => void;