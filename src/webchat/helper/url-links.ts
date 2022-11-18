const urlMatcherRegex = /(^|\s)(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/\S*)?/gm

/**
 * Helper function that will replace any URL in a string with HTML anchor elements.
 * - Will also work with urls that start with www. or just the domain/subdomain
 * @limitations 
 * - This will only match any url at the beginning or following a whitespace, to not break any existing HTML
 * - Will not work with emails
 * @param text The Text that should get URLs replaced with <a> elements
 * @returns The Text with <a> elements in place of the urls
 */
export const replaceUrlsWithHTMLanchorElem = (text: string) => {

    const enhancedText = text.replace(urlMatcherRegex, (url, leadingSymbol) => {
        const trimmedUrl = url.trim();

        let enhancedUrl = trimmedUrl;
        if (!url.startsWith("http")) enhancedUrl = "//" + trimmedUrl;

        return `${leadingSymbol}<a href=${enhancedUrl} target='blank'>${trimmedUrl}</a>`
    });

    return enhancedText;
};