export interface ITranslateGoogleBody {
    q: string[];
    target: string;
    source?: string;
}

export interface ITranslateGoogleTranslation {
    detectedSourceLanguage: string;
    translatedText: string;
}

export interface ITranslateGooglePromise {
    data: {
        translations: ITranslateGoogleTranslation[];
    }
}

export interface ITranslateMicrosoftBody {
    Text: string;
}

export interface ITranslateMicrosoftTranslation {
    text: string;
}

export interface ITranslateMicrosoftPromise {
    detectedLanguage: {
        language: string;
    },
    translations: ITranslateMicrosoftTranslation[];
}

export interface ITranslateDeepLTranslations {
    detected_source_language: string;
    text: string;
}

export interface ITranslateDeepLPromise {
    translations: ITranslateDeepLTranslations[];
}