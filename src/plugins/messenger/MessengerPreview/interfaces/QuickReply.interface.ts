export type IFBMQuickReply =
  | IFBMTextQuickReply
  | IFBMLocationQuickReply
  | IFBMPhoneQuickReply
  | IFBMEmailQuickReply;

export interface IFBMTextQuickReply {
  content_type: "text";
  title: string;
  payload: string;
  image_url?: string;
  image_alt_text?: string;
}

export interface IFBMLocationQuickReply {
  content_type: "location";
}

export interface IFBMPhoneQuickReply {
  content_type: "user_phone_number";
}

export interface IFBMEmailQuickReply {
  content_type: "user_email";
}
