export type IFBMButton = IFBMURLButton 
    | IFBMPostbackButton
    | IFBMElementShareButton
    | IFBMPhoneNumberButton
    | IFBMAccountLinkButton
    | IFBMAccountUnlinkButton;

export interface IFBMURLButton {
    type: 'web_url';
    url: string;
    title: string;
}

export interface IFBMPostbackButton {
    type: 'postback';
    title: string;
    payload: string;
}

export interface IFBMElementShareButton {
    type: 'element_share'
}

export interface IFBMPhoneNumberButton {
    type: 'phone_number';
    title: string;
    payload: string;
}

export interface IFBMAccountLinkButton {
    type: 'account_link';
    url: string;
}

export interface IFBMAccountUnlinkButton {
    type: 'account_unlink';
}

