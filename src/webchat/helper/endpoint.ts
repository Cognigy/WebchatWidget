import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { fetch } from 'whatwg-fetch';
import { IUploadFileMetaData, IUploadFileToken } from '../../common/interfaces/file-upload';
import { IWebchatConfig } from '../../common/interfaces/webchat-config';

export const getEndpointBaseUrl = (webchatConfigUrl: string) => {
    const partials = webchatConfigUrl.split('/');
    partials.splice(partials.length - 1, 1);

    return partials.join('/');
}

export const getEndpointUrlToken = (webchatConfigUrl: string) => {
    return webchatConfigUrl.split('/').pop() as string;
}

export const fetchWebchatConfig = async (webchatConfigUrl: string, timeout: number):Promise<IWebchatConfig | null> => {
    const abortableFetch = ('signal' in new Request('')) ? window.fetch : fetch
    const controller = new AbortController()
    const config = setTimeout(() => controller.abort(), timeout);
    let response = null;
    try{
        response = await abortableFetch(webchatConfigUrl, {
            signal: controller.signal
        });
    }catch(err) {
        if((err as Error).name === "AbortError"){
            console.warn('Unable to fetch endpoint configuration in time')
        }
    }
    
    clearTimeout(config);
        return response ? (response as Response).json(): null

}

export const fetchFileUploadToken = async (fileUploadTokenUrl: string) => {
    const response = await fetch(fileUploadTokenUrl);
    return response.json() as IUploadFileToken;
}

export const uploadFile = async (file: File, fileUploadUrl: string, token: string) => {
    const axiosRequest: AxiosRequestConfig = {
        data: { "file": file },
        headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
        method: "POST",
        url: fileUploadUrl
    };
    const axiosResponse: AxiosResponse = await Axios(axiosRequest);

    return axiosResponse.data as IUploadFileMetaData;
}