import { CSSProperties } from "@emotion/serialize";
import { StylisPlugin } from '@emotion/cache';

export const interactionCss: CSSProperties = {
    minWidth: 40,
    minHeight: 40,
    boxSizing: 'border-box'
}



export const createTransition = (...properties: string[]) => {
    return properties.map(p => `${p} .1s ease-out`).join(', ');
}


const meyerResetJss = {
    'html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video': {
        margin: '0',
        padding: '0',
        border: '0',
        fontSize: '100%',
        font: 'inherit',
        verticalAlign: 'baseline'
    },
    'article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section': {
        display: 'block'
    },
    body: {
        lineHeight: 1,
        color: 'black'
    },
    'ol, ul': {
        listStyle: 'none'
    },
    'blockquote, q': {
        quotes: 'none'
    },
    'blockquote:before, blockquote:after, q:before, q:after': {
        content: 'none'
    },
    table: {
        borderCollapse: 'collapse',
        borderSpacing: 0
    }
};

const prefixJssObject = (jssObject, selector = '') => {
    const ret = {}

    for (const key in jssObject) {
        const value = jssObject[key];

        const newKey = key
            .split(',')
            .map(key => `${selector} ${key}`)
            .join(',');

        ret[newKey] = value;
    }

    return ret;
}

export const reset = prefixJssObject(meyerResetJss, '[data-cognigy-webchat-root]')

// this will cause all css selectors to be prefixed by a string. 
// .classA { ... }
// .somePrefix .classA {...}
export const isolate = (prefix: string): StylisPlugin => (context, content: string, selectors) => 
    context === -2
        ? content.split(selectors[0]).join(`${prefix} ${selectors[0]}`)
        : content