export interface IUploadFileMetaData {
    runtimeFileId: string;
    fileName?: string;
    status?: "infected" | "scanned";
    mimeType: string;
    size: number;
    url: string;
}

export interface IUploadFileToken {
    token: string;
    fileUploadUrl: string;
}