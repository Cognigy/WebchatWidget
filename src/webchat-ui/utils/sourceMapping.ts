import { IWebchatSettings, TSourceColorV3 } from "../../common/interfaces/webchat-config";

export function getSourceBackgroundColor(colorKey: TSourceColorV3, colors: IWebchatSettings["colors"]): string | null {
    if (colorKey === "bot") {
        return colors.botMessageColor;
    } else if (colorKey === "user") {
        return colors.userMessageColor;
    } else {
        return null;
    }
}
