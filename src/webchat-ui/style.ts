import styledOriginal, { CreateStyled } from '@emotion/styled';
import tinycolor from 'tinycolor2';
import { join } from 'path';

export interface IWebchatTheme {
    primaryColor: string;
    primaryStrongColor: string;
    primaryWeakColor: string;
    primaryContrastColor: string;
    primaryGradient: string;
    primaryStrongGradient: string;

    greyColor: string;
    greyStrongColor: string;
    greyWeakColor: string;
    greyContrastColor: string;

    shadow: string;
    messageShadow: string;

    unitSize: number;
    blockSize: number;
    cornerSize: number;

    fontFamily: string;
}

export const transformContrastColor = (color: string) => tinycolor(color)
    .setAlpha(.95)
    .toHslString();

export const getContrastColor = (color: string) => transformContrastColor(tinycolor(color).isLight()
    ? 'black'
    : 'white');

export const getActionColor = (color: string) => tinycolor(color).triad()[2].brighten(5).toHslString()

const strong = (color: string) =>
    (tinycolor(color).isLight()
        ? tinycolor(color).lighten()
        : tinycolor(color).darken())
        .toHslString()

const weak = (color: string) =>
    (tinycolor(color).isLight()
        ? tinycolor(color).darken()
        : tinycolor(color).lighten())
        .toHslString()

const getGradient = (color: string) => {

    const base = tinycolor(color);

    const amount = 12;
    const left = base.clone().brighten(4);
    const right = base.clone();

    const gradient = `linear-gradient(185deg, ${left}, ${right})`;

    return gradient;
}

const cognigyBlue = '#3f51b5';


export const createWebchatTheme = (theme: Partial<IWebchatTheme> = {}): IWebchatTheme => {
    if (!theme.primaryColor)
        theme.primaryColor = cognigyBlue;

    if (!theme.primaryWeakColor)
        theme.primaryWeakColor = weak(theme.primaryColor);

    if (!theme.primaryStrongColor)
        theme.primaryStrongColor = strong(theme.primaryColor);

    if (!theme.primaryContrastColor)
        theme.primaryContrastColor = getContrastColor(theme.primaryColor);

    if (!theme.primaryGradient)
        theme.primaryGradient = getGradient(theme.primaryColor);

    if (!theme.primaryStrongGradient)
        theme.primaryStrongGradient = getGradient(theme.primaryStrongColor);
    
    if (!theme.shadow)
        theme.shadow = '0 5px 18px 0 rgba(151, 124, 156, 0.2), 0 5px 32px 0 rgba(203, 195, 212, 0.2), 0 8px 58px 0 rgba(216, 212, 221, 0.1)';

    if (!theme.messageShadow)
        theme.messageShadow = '0 5px 9px 0 rgba(151,124,156,0.1), 0 5px 16px 0 rgba(203,195,212,0.1), 0 8px 20px 0 rgba(216,212,221,0.1)';


    if (!theme.greyColor)
        theme.greyColor = '#e6e6e6';

    if (!theme.greyWeakColor)
        theme.greyWeakColor = weak(theme.greyColor);

    if (!theme.greyStrongColor)
        theme.greyStrongColor = strong(theme.greyColor);

    if (!theme.greyContrastColor)
        theme.greyContrastColor = getContrastColor(theme.greyColor);


    if (!theme.unitSize)
        theme.unitSize = 8;

    if (!theme.blockSize)
        theme.blockSize = theme.unitSize * 7;

    if (!theme.cornerSize)
        theme.cornerSize = theme.unitSize / 2;


    if (!theme.fontFamily)
        theme.fontFamily = 'sans-serif'


    return theme as IWebchatTheme;
}

export interface IColorProps { color?: 'primary' | 'default' | 'grey' };

export const styled = styledOriginal as CreateStyled<IWebchatTheme>;