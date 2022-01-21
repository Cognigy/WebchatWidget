import { IFBMButton } from "./Button.interface";
import { IFBMDefaultAction } from "./Action.interface";

export interface IFBMListTemplatePayload {
  template_type: "list";
  top_element_style: "large" | "compact" | boolean;
  elements: IFBMListTemplateElement[];
  buttons: IFBMButton[];
}

export interface IFBMListTemplateElement {
  title: string;
  subtitle: string;
  image_url: string;
  image_alt_text?: string;
  buttons: IFBMButton[];
  default_action: IFBMDefaultAction;
}
