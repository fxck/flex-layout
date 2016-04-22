export function isNumber(value) {
  return typeof value == 'number';
}

export function toInt(value: string|number): number {
  return <number>(parseInt(value.toString(), 10));
}

export function toFloat(value: string|number): number {
  return <number>(parseFloat(value.toString()));
}

export function isPresent(value) {
  return value != null;
}

export function roundDecimal(value: number, totalDigits: number = 2) {
  var base = 1;
  for (var i = 0; i < totalDigits; i++) base *= 10;
  return Math.round(value * base) / base;
}

export function isArray(value: any) {
  return Array.isArray(value);
}

export function isStringMap(obj: any): boolean {
  return typeof obj === 'object' && obj !== null;
}

export function forEach(collection: any[]|{[key: string]: any}, fn: Function) {
  if (isArray(collection)) {
    (<any[]>collection).forEach((value, index) => fn(value, index));
  } else if (isStringMap(collection)) {
    for (var key in collection) {
      let value = collection[key];
      fn(value, key);
    }
  } else {
    throw new Error('invalid value passed into forEach');
  }
}

export function toJson(value: any) {
  return JSON.stringify(value);
}
