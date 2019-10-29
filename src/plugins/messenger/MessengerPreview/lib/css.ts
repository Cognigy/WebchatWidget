export const getBackgroundImage = (url: string) => {  
    const escapedUrl = url
        // remove line breaks
        .replace(/\n/g, '')
        // escape " and \
        .replace(/\"\\/g, char => `\${char}`);

    return `url("${escapedUrl}")`
};