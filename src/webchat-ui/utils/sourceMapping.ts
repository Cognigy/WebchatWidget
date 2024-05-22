import { IWebchatSettings, TSourceColorV3 } from "../../common/interfaces/webchat-config";

export function getSourceBackgroundColor(mappedValue: TSourceColorV3, colors: IWebchatSettings["colors"]): string | null {
    if (mappedValue === "bot") {
        return colors.botMessageColor;
    } else if (mappedValue === "user") {
        return colors.userMessageColor;
    } else {
        return null;
    }
}
