export function isValidJSON(json: unknown): boolean {
    if (typeof json !== "string") {
        return false;
    }
    try {
        JSON.parse(json);
        return true;
    } catch (error) {
        return false;
    }
}