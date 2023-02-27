import { IWebchatConfig } from '../../../../common/interfaces/webchat-config';

export interface IFBMImage {
    config: IWebchatConfig;
    url: string;
    isDownloadable?: boolean;
    altText?: string;
    template?: 'media' | 'list' | 'generic'
}