import { IFBMMessage, IFBMAttachmentMessage, IFBMRegularMessage } from "../interfaces/Message.interface";
import { IFBMMediaTemplateElementMediaType } from "../interfaces/MediaTemplatePayload.interface";
import { IFBMButton } from "../interfaces/Button.interface";
import { IFBMListTemplatePayload } from "../interfaces/ListTemplatePayload.interface";
import { IFBMQuickReply } from "../interfaces/QuickReply.interface";

type IFBMTransformer = (message: IFBMMessage) => IFBMMessage;

export interface IFBMUploadAPIMessage {
    attachment: {
        type: IFBMMediaTemplateElementMediaType,
        payload: {
			url: string,
			altText?: string;
            is_reusable: boolean,
        }
    }
}

const isUploadAPIMessage = (message: IFBMMessage | IFBMUploadAPIMessage) => {
    if (!message)
        return false;

    const { attachment } = message as IFBMUploadAPIMessage;

    if (!attachment)
        return false;

    const { type } = attachment;

    if (!type)
        return false;

    return ['image', 'video', 'audio', 'file'].includes(type);
}


const transformAttachmentUploadApiMessage = (message: IFBMMessage | IFBMUploadAPIMessage): IFBMMessage => {
    const { attachment } = message as IFBMAttachmentMessage;

    // regular text message
    if (!attachment)
        return message as IFBMMessage;

    // regular template message
    if (attachment.type === 'template')
        return message as IFBMMessage;

    const { type: media_type, payload: { url, altText } } = attachment as unknown as IFBMUploadAPIMessage['attachment'];

    return {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'media',
                elements: [{
                    media_type,
					url,
					altText,
                    buttons: attachment.payload.buttons || []
                }]
            }
        }
    }
}

type ButtonFilter = (button: IFBMButton) => boolean;
const filterButtons = (filter: ButtonFilter): IFBMTransformer => (message) => {
    const { attachment } = message as IFBMAttachmentMessage;
    if (attachment) {
        const { payload } = attachment;

        switch (payload.template_type) {
            case 'button': {
                return {
                    ...message,
                    attachment: {
                        ...attachment,
                        payload: {
                            ...payload,
                            buttons: payload.buttons
                                ? payload.buttons.filter(filter)
                                : payload.buttons
                        }
                    }
                }
            }

            case 'generic': {
                return {
                    ...message,
                    attachment: {
                        ...attachment,
                        payload: {
                            ...payload,
                            elements: payload.elements.map(element => ({
                                ...element,
                                buttons: element.buttons
                                    ? element.buttons.filter(filter)
                                    : element.buttons
                            }))
                        }
                    }
                }
            }

            case 'list': {
                return {
                    ...message,
                    attachment: {
                        ...attachment,
                        payload: {
                            ...payload,
                            buttons: payload.buttons
                                ? payload.buttons.filter(filter)
                                : payload.buttons,
                            elements: payload.elements.map(element => ({
                                ...element,
                                buttons: element.buttons
                                    ? element.buttons.filter(filter)
                                    : element.buttons
                            }))
                        }
                    }
                }
            }

            case 'media': {
                return message;
            }
        }
    }

    return message;
}
const removeUnsupportedButtons = filterButtons(button => button.type !== 'element_share');


type QuickReplyFilter = (quickReply: IFBMQuickReply) => boolean;
const filterQuickReplies = (filter: QuickReplyFilter): IFBMTransformer => (message) => {
    const { quick_replies } = message as IFBMRegularMessage;
    if (quick_replies) {
        return {
            ...message,
            quick_replies: quick_replies.filter(filter)
        }
    }

    return message;
}

const removeEmptyQuickReplies = filterQuickReplies(q => !(q.content_type === 'text' && !q.title));

export const transformMessage = (message: IFBMMessage | IFBMUploadAPIMessage): IFBMMessage => {
    message = transformAttachmentUploadApiMessage(message);
    message = removeUnsupportedButtons(message);
    message = removeEmptyQuickReplies(message);

    return message;
}