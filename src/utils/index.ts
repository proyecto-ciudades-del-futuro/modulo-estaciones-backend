export function parseToFloatsArray(stringArray: string[]): number[] {
  return stringArray.map(str => parseFloat(str));
}


export type OrionMetadata = {
  [key: string]: {
    value: string | number | [] | { [key: string]: string }
  }
}

export function adaptUserToOrionMetadata(inputMetadata: { [key: string]: any }): OrionMetadata {
  let orionData: OrionMetadata = {};
  for (const key in inputMetadata) {
    orionData[key] = {
      value: inputMetadata[key]
    }
  }
  return orionData;
}

function reverseAdapter(orionData: OrionMetadata): object {
  let userData: any = {};
  for (const key in orionData) {
    userData[key] = orionData[key].value;

  }
  return userData;
}


export function convertStringsToNumbers(arr: (number | string)[]): number[] {
  return arr.map(item => {
    if (typeof item === 'string') {
      let num = parseFloat(item);
      if (isNaN(num)) {
        throw new Error(`Invalid number string: ${item}`);
      }
      return num;
    }
    return item;
  });
}
