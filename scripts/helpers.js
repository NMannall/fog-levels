/**
* Find the first property name that holds a given value
* @param {Array<Object>} obj 
* @param {any | undefined} value 
* @returns property name that holds the value. Undefined if there is no such value
*/
export function propertyNameForValue(obj, value){
    return Object.keys(obj).find(key => obj[key] === value)
}