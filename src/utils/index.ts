
export function parseToIntArray(stringArray: string[]): number[] {
    console.log(stringArray)
    return stringArray.map(str => parseFloat(str));
}