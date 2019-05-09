import { IFBMButton } from "./Button.interface";

export interface IFBMButtonTemplatePayload {
    template_type: 'button';
    text: string;
    buttons: IFBMButton[];
}