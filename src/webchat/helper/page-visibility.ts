/**
 * This is an example implementation of a compatiblity layer for the
 * page visibility API which was copied from MDN and slightly modified
 * 
 * https://developer.mozilla.org/de/docs/Web/API/Page_Visibility_API
 */


// Set the name of the hidden property and the change event for visibility
const { hidden, visibilityChange } = (() => {
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
        return { hidden: "hidden", visibilityChange: "visibilitychange" };
        
        // @ts-ignore
    } else if (typeof document.msHidden !== "undefined") {
        return { hidden: "msHidden", visibilityChange: "msvisibilitychange" };
        
        // @ts-ignore
    } else if (typeof document.webkitHidden !== "undefined") {
        return { hidden: "webkitHidden", visibilityChange: "webkitvisibilitychange" };
    }

    return {
        hidden: undefined,
        visibilityChange: undefined
    }
})();

const isPageVisibilitySupported = () => hidden && typeof document[hidden] !== "undefined";
export const isPageVisible = () => {
    if (!isPageVisibilitySupported())
        return true;

    return !document[hidden as string];
}

type TVisibilityHandler = (visible: boolean) => void;
type THandlerRemover = () => void;

/**
 * This method can be used to register a visibility change for the document.
 * The "handler" function will be called with either true (page is visible) or false (page is hidden)
 * 
 * Returns a "teardown" function which will unregister the event listener
 * 
 * @param handler 
 */
export const onVisibilityChange = (handler: TVisibilityHandler): THandlerRemover => {
    const internalHandler = () => handler(isPageVisible());

    document.addEventListener(visibilityChange as string, internalHandler, false);

    return () => {
        document.removeEventListener(visibilityChange as string, internalHandler);
    };
}

if (!isPageVisibilitySupported()) {
    console.log('Page visibility API seems to be unsupported, page will always count as "visible".');
}