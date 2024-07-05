import { IWebchatSettings, TSourceColor } from "../../common/interfaces/webchat-config";

export function getSourceBackgroundColor(mappedValue: TSourceColor, colors: IWebchatSettings["colors"]): string | null {
    if (mappedValue === "bot") {
        return colors.botMessageColor || "#FFFFFF";
    } else if (mappedValue === "user") {
        return colors.userMessageColor || "#E8EBFF";
    } else {
        return null;
    }
}
