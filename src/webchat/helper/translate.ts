import { ITranslateDeepLPromise, ITranslateGoogleBody, ITranslateGooglePromise, ITranslateMicrosoftBody, ITranslateMicrosoftPromise } from "../../common/interfaces/translate";
import axios from "axios";

/**
 * Translate a list of text messages with Google
 * @param `textArray` A list of string text messages
 * @param `toLanguage` The language code of the target language
 * @param `fromLanguage` The language code of the source language
 */
const googleTranslate = async (apiKey: string, textArray: string[], toLanguage: string, fromLanguage?: string): Promise<ITranslateGooglePromise> => {

    let data: ITranslateGoogleBody = { 'q': textArray, 'target': toLanguage };

    if (fromLanguage) {
        data['source'] = fromLanguage
    }

    const response = await axios({
        method: "POST",
        url: `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        headers: {
            "Content-type": "application/json"
        },
        data
    });

    return response.data;
}

/**
 * Translate a list of text messages with Microsoft
 * @param `textArray` A list of string text messages
 * @param `toLanguage` The language code of the target language
 * @param `fromLanguage` The language code of the source language
 */
async function microsoftTranslate(apiKey: string, textArray: string[], toLanguage: string, fromLanguage?: string): Promise<ITranslateMicrosoftPromise[]> {
    const data: ITranslateMicrosoftBody[] = [];

    textArray.forEach(text => {
        data.push({ 'Text': text })
    });

    let url = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${toLanguage}`
    if (fromLanguage) {
        url += `&from=${fromLanguage}`
    }

    const response = await axios({
        method: "POST",
        url,
        headers: {
            "Ocp-Apim-Subscription-Key": apiKey,
            "Content-type": "application/json"
        },
        data
    });

    return response.data;
}

/**
 * Translate a list of text messages with DeepL
 * @param `textArray` A list of string text messages
 * @param `toLanguage` The language code of the target language
 * @param `fromLanguage` The language code of the source language
 */
async function deepLTranslate(apiKey: string, textArray: string[], toLanguage: string, fromLanguage?: string): Promise<ITranslateDeepLPromise> {

    // Initialize string for HTTP text query paramters -> &text=...&text=...
    let textQueryString: string = '';

    // Build the text query string/s based on the number of texts in the array
    textArray.forEach(text => {
        textQueryString += `&text=${text}`
    })

    const response = await axios({
        method: "POST",
        url: `https://api.deepl.com/v2/translate?auth_key=${apiKey}&target_lang=${toLanguage}${textQueryString}`,
        headers: {
            "Accept": "*/*",
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });

    return response.data;
}

const translate = async (translator: ("google" | "microsoft" | "deepl"), apiKey: string, textArray: string[], toLanguage: string, fromLanguage?: string): Promise<string[]> => {

    if (toLanguage === fromLanguage) {
        return textArray;
    }

    let textsTranslated: string[] = [];

    if (translator === 'google') {
        const googleTranslation = await googleTranslate(apiKey, textArray, toLanguage, fromLanguage);
        googleTranslation.data.translations.forEach(element => {
            textsTranslated.push(element.translatedText);
        });
    } else if (translator === 'microsoft') {
        const microsoftTranslation = await microsoftTranslate(apiKey, textArray, toLanguage, fromLanguage);
        microsoftTranslation.forEach(element => {
            textsTranslated.push(element.translations[0].text);
        });
    } else if (translator === 'deepl') {
        const deeplTranslation = await deepLTranslate(apiKey, textArray, toLanguage, fromLanguage);
        deeplTranslation.translations.forEach(element => {
            textsTranslated.push(element.text);
        });
    }

    return textsTranslated;
}