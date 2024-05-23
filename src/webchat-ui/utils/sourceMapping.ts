import { IWebchatSettings, TSourceColor } from "../../common/interfaces/webchat-config";

export function getSourceBackgroundColor(mappedValue: TSourceColor, colors: IWebchatSettings["colors"]): string | null {
    if (mappedValue === "bot") {
        return colors.botMessageColor;
    } else if (mappedValue === "user") {
        return colors.userMessageColor;
    } else {
        return null;
    }
}
