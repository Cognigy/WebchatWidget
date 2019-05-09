import { IFBMButton } from "./Button.interface";

export interface IFBMMediaTemplatePayload {
    template_type: 'media',
    elements: IFBMMediaTemplateElement[];
}


export type IFBMMediaTemplateElementMediaType = 'image' | 'video' | 'audio' | 'file';

export type IFBMMediaTemplateElement = IFBMMediaTemplateAttachedElement | IFBMMediaTemplateUrlElement;

export interface IFBMMediaTemplateAttachedElement {
    media_type: IFBMMediaTemplateElementMediaType;
    attachment_id: string;
    buttons: IFBMButton[];
}

export interface IFBMMediaTemplateUrlElement {
    media_type: IFBMMediaTemplateElementMediaType;
    url: string;
    buttons: IFBMButton[];
}