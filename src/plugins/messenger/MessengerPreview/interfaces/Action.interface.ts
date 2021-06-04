export interface IFBMDefaultAction {
    type: 'web_url';
    url: string;
    messenger_extensions: boolean;
    webview_height_ratio: 'compact' | 'tall' | 'full';
    target?: '_self' | '_blank'
}