export function containsObject(obj, list) {
    var x;
    for (x in list) {
        if (list.hasOwnProperty(x) && list[x] === obj) {
            return true;
        }
    }

    return false;
}

export function isEmpty(obj) {
    return !obj || Object.keys(obj).length === 0;
}
