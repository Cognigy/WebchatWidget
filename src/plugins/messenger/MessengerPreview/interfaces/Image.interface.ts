import { IWebchatConfig } from '../../../../common/interfaces/webchat-config';

export interface IFBMImage {
    config: IWebchatConfig;
    url: string;
    altText?: string;
    template?: 'media' | 'list' | 'generic'
}