import { IFBMButton } from "./interfaces/Button.interface";
import { IFBMDefaultAction } from "./interfaces/Action.interface";
import { IFBMQuickReply } from "./interfaces/QuickReply.interface";

export type FBMActionEventHandler = (
  e: React.MouseEvent,
  action: IFBMButton | IFBMDefaultAction | IFBMQuickReply
) => void;

export interface IWithFBMActionEventHandler {
  onAction: FBMActionEventHandler;
}
