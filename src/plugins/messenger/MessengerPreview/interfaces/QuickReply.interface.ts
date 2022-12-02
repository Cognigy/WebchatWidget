export type IFBMQuickReply = IFBMTextQuickReply
    | IFBMLocationQuickReply
    | IFBMEmailQuickReply;

export interface IFBMTextQuickReply {
    content_type: 'text' | 'user_phone_number';
    title: string;
    payload: string;
    image_url?: string;
	image_alt_text?: string;
}

export interface IFBMLocationQuickReply {
    content_type: 'location';
}

export interface IFBMEmailQuickReply {
    content_type: 'user_email';
}