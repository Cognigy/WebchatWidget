import { TSourceColor } from "../../common/interfaces/webchat-config";

export function getSourceBackgroundColor(colorKey: TSourceColor, primaryColor: string): string | null {
    if (colorKey === "primary") {
        return primaryColor;
    } else if (colorKey === "neutral") {
        return "rgb(255, 255, 255)";
    } else {
        return null;
    }
}
