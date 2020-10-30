export const findReverse = <T>(array: T[], predicate: (item: T) => boolean): (T | void) => {
    for (let i=array.length-1; i>=0; i--) {
        const item = array[i];
        
        if (predicate(item))
            return item;
    }
}