import { IFBMQuickReply } from "./QuickReply.interface";
import { IFBMButtonTemplatePayload } from "./ButtonTemplatePayload.interface";
import { IFBMGenericTemplatePayload } from "./GenericTemplatePayload.interface";
import { IFBMListTemplatePayload } from "./ListTemplatePayload.interface";
import { IFBMMediaTemplatePayload } from "./MediaTemplatePayload.interface";

export type IFBMMessage = IFBMRegularMessage
    | IFBMAttachmentMessage;

export interface IFBMRegularMessage {
    text: string;
    quick_replies?: IFBMQuickReply[]
}

export interface IFBMAttachmentMessage {
    attachment: IFBMTemplateAttachment;
}

type IFBMTemplatePayload = IFBMButtonTemplatePayload
    | IFBMGenericTemplatePayload
    | IFBMListTemplatePayload
    | IFBMMediaTemplatePayload;

interface IFBMTemplateAttachment {
    type: 'template';
    payload: IFBMTemplatePayload;
}

