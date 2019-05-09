import { IFBMDefaultAction } from "./Action.interface";
import { IFBMButton } from "./Button.interface";

export interface IFBMGenericTemplatePayload {
    template_type: 'generic';
    elements: IFBMGenericTemplateElement[];
}

export interface IFBMGenericTemplateElement {
    title: string;
    image_url: string;
    subtitle: string;
    default_action: IFBMDefaultAction;
    buttons: IFBMButton[];
}