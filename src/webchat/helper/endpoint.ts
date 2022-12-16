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

export const fetchWebchatConfig = async (webchatConfigUrl: string) => {
    const response = await fetch(webchatConfigUrl);
    return response.json() as IWebchatConfig;
}

export const fetchFileUploadToken = async (fileUploadTokenUrl: string) => {
    const response = await fetch(fileUploadTokenUrl);
    return response.json() as IUploadFileToken;
}

export const uploadFile = async (file: any, fileUploadUrl: string, token: string) => {
    const axiosRequest: AxiosRequestConfig = {
        data: { "file": file },
        headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
        method: "POST",
        url: fileUploadUrl
    };
    let axiosResponse: AxiosResponse;
    axiosResponse = await Axios(axiosRequest);

    return axiosResponse.data as IUploadFileMetaData;
}