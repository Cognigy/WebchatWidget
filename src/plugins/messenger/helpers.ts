type TPointedObject =
    | {
        [key: string]: any;
    }
    | {
        _pointer?: string;
    };

export const transformPointers = (obj: TPointedObject) => {
    if (Array.isArray(obj) || typeof obj !== "object" || obj === null) return obj;

    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty("_pointer")) {
        obj = obj[obj["_pointer"]];
        return transformPointers(obj);
    }

    Object.keys(obj).forEach(key => {
        obj[key] = transformPointers(obj[key]);
    });
    return obj;
};