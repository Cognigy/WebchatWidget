import tinycolor from 'tinycolor2';

export interface IWebchatTheme {
    // Webchat V3 theme colors
    // Primary Colors
    primaryColor: string;
    primaryColorHover: string;
    primaryColorDisabled: string;
    primaryContrastColor: string;

    // Secondary Colors
    secondaryColor: string;
    secondaryColorHover: string;
    secondaryColorDisabled: string;
    secondaryContrastColor: string;

    // Meta Colors
    backgroundHome: string;
    backgroundWebchat: string;
    backgroundBotMessage: string;
    backgroundUserMessage: string;
    backgroundEngagementMessage: string;

    textLink: string;
    textLinkHover: string;
    textLinkDisabled: string;

    //Basic Colors
    black10: string;
    black20: string;
    black40: string;
    black60: string;
    black80: string;
    black95: string;
    white: string;

    textDark: string;
    textLight: string;

    // Confirmation Colors
    green: string;
    green10: string;
    red: string;
    red10: string;


    // Legacy Webchat V2 theme colors
    primaryStrongColor: string;
    primaryWeakColor: string;
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

const BLACK_10 = "#1A1A1A";

export const transformContrastColor = (color: string) => tinycolor(color)
    .setAlpha(.95)
    .toHslString();

export const getContrastColor = (color: string) => transformContrastColor(tinycolor(color).isLight()
    ? BLACK_10
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

const deriveHoverColor = (color: string) => {
    const hslColor = tinycolor(color).toHsl()
    const lightness = hslColor.l;
    const hoverLightness = lightness >= 0.5 ? (lightness - 0.2) : (lightness + 0.2);
    hslColor.l = hoverLightness;

    return tinycolor(hslColor).toHslString();
};

const deriveDisabledColor = (color: string) => {
    const hslColor = tinycolor(color).toHsl()
    hslColor.l = 0.9;

    return tinycolor(hslColor).toHslString();
};

export const createWebchatTheme = (theme: Partial<IWebchatTheme> = {}): IWebchatTheme => {

    const htmlDirection = document?.documentElement?.dir;
    const bodyDirection = document?.body?.dir;
    const isRTL = htmlDirection === 'rtl' || bodyDirection === 'rtl';

    // Webchat endpoint default color
    const webchatEndpointDefaultColor = '#2455E6';

    // Webchat 3 Theme color defaults
    const primaryColor = '#2455E6';

    const secondaryColor = '#1A1A1A';

    let backgroundHome = 'radial-gradient(204.5% 136.79% at 0.53% 95.79%, #EDECF9 0%, #BFBAFF 31.77%, #2152E3 65.63%, #05309E 100%)';
    if (isRTL) {
        backgroundHome = 'radial-gradient(at right 95.79%, hsl(225, 80%, 32%) 0%, #2455E6 34.37%, hsl(225, 80%, 72%) 68.23%, hsl(225, 79%, 92%) 100%)';
    }
    const backgroundWebchat = "#FFFFFF";
    const backgroundBotMessage = "#FFFFFF";
    const backgroundUserMessage = "#E8EBFF";
    const backgroundEngagementMessage = "#FFFFFF";

    const textLink = "#6688ED";
    const textLinkHover = "#1947D2";
    const textLinkDisabled = "#D1DCFA";

    const black10 = BLACK_10;
    const black20 = "#333333";
    const black40 = "#666666";
    const black60 = "#999999";
    const black80 = "#CCCCCC";
    const black95 = "#F2F2F2";
    const white = "#FFFFFF";

    const textDark = black10;
    const textLight = white;

    const green = "#009918";
    const green10 = "#E5F5E8";
    const red = "#FF0000";
    const red10 = "#FFE5E5";


    // calculate new gradient based on optional theme.primaryColor if no theme.backgroundHome is given
    if ((theme.primaryColor && theme.primaryColor !== webchatEndpointDefaultColor) && !theme.backgroundHome) {
        if (tinycolor(theme.primaryColor).isLight()) {
            backgroundHome = `radial-gradient(204.5% 136.79% at 0.53% 95.79%, ${tinycolor(theme.primaryColor).lighten(20).toHslString()} 0%, ${theme.primaryColor} 31.77%, ${tinycolor(theme.primaryColor).darken(20).toHslString()} 65.63%, ${tinycolor(theme.primaryColor).darken(40).toHslString()} 100%)`;
        } else {
            backgroundHome = `radial-gradient(204.5% 136.79% at 0.53% 95.79%, ${tinycolor(theme.primaryColor).lighten(40).toHslString()} 0%, ${tinycolor(theme.primaryColor).lighten(20).toHslString()} 31.77%, ${theme.primaryColor} 65.63%, ${tinycolor(theme.primaryColor).darken(20).toHslString()} 100%)`;
        }
    }

    if (!theme.primaryColor)
        theme.primaryColor = primaryColor;

    if (!theme.primaryColorHover)
        theme.primaryColorHover = deriveHoverColor(theme.primaryColor)

    if (!theme.primaryColorDisabled)
        theme.primaryColorDisabled = deriveDisabledColor(theme.primaryColor);

    if (!theme.primaryContrastColor)
        theme.primaryContrastColor = tinycolor(theme.primaryColor).isLight() ? textDark : textLight;

    if (!theme.secondaryColor)
        theme.secondaryColor = secondaryColor;

    if (!theme.secondaryColorHover)
        theme.secondaryColorHover = deriveHoverColor(theme.secondaryColor)

    if (!theme.secondaryColorDisabled)
        theme.secondaryColorDisabled = deriveDisabledColor(theme.secondaryColor);

    if (!theme.secondaryContrastColor)
        theme.secondaryContrastColor = tinycolor(theme.secondaryColor).isLight() ? textDark : textLight;

    if (!theme.backgroundHome)
        theme.backgroundHome = backgroundHome;

    if (!theme.backgroundWebchat)
        theme.backgroundWebchat = backgroundWebchat;

    if (!theme.backgroundBotMessage)
        theme.backgroundBotMessage = backgroundBotMessage;

    if (!theme.backgroundUserMessage)
        theme.backgroundUserMessage = backgroundUserMessage;

    if (!theme.backgroundEngagementMessage)
        theme.backgroundEngagementMessage = backgroundEngagementMessage;

    if (!theme.textLink)
        theme.textLink = textLink;

    if (!theme.textLinkHover)
        theme.textLinkHover = textLinkHover;

    if (!theme.textLinkDisabled)
        theme.textLinkDisabled = textLinkDisabled;

    if (!theme.black10)
        theme.black10 = black10;

    if (!theme.black20)
        theme.black20 = black20;

    if (!theme.black40)
        theme.black40 = black40;

    if (!theme.black60)
        theme.black60 = black60;

    if (!theme.black80)
        theme.black80 = black80;

    if (!theme.black95)
        theme.black95 = black95;

    if (!theme.white)
        theme.white = white;

    if (!theme.textDark)
        theme.textDark = textDark;

    if (!theme.textLight)
        theme.textLight = textLight;

    if (!theme.green)
        theme.green = green;

    if (!theme.green10)
        theme.green10 = green10;

    if (!theme.red)
        theme.red = red;

    if (!theme.red10)
        theme.red10 = red10;

    if (!theme.primaryWeakColor)
        theme.primaryWeakColor = weak(theme.primaryColor);

    if (!theme.primaryStrongColor)
        theme.primaryStrongColor = strong(theme.primaryColor);

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
        theme.fontFamily = 'Figtree, sans-serif'


    return theme as IWebchatTheme;
}

export interface IColorProps { color?: 'primary' | 'default' | 'grey' }