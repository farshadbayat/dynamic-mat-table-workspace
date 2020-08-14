/**
 * check object is null or undefined
 */
export function isNull(value: any): boolean {
  if ( value === null || value === undefined) {
    return true;
  } else {
    return false;
  }
}

/**
 * clone object but refrence variable not change
 */
export function clone<T>(obj: any): any {
  if ( obj === null || obj === undefined) {
    return obj;
  } else if ( Array.isArray(obj)) {
    const array: T[] = [];
    obj.forEach( item => array.push( Object.assign({}, item)));
    return array;
  } else {
    return Object.assign({}, obj);
  }
}

/**
 * clone object but refrence variable not change
 */
export function deepClone<T>(obj: any) {
  if ( obj === null || obj === undefined) {
    return obj;
  } else if ( Array.isArray(obj)) {
    const array: T[] = [];
    obj.forEach( item => array.push( deepClone<typeof item>(item) ));
    return array as T[];
  } else {
    const c = Object.assign({} as T, obj);
    const fields: string[] = Object.getOwnPropertyNames(obj);
    fields.forEach( f => {
      const field = obj[f];
      if ( typeof field === 'object' ) {
        c[f] = deepClone<typeof field>(field);
      }
    });
    return c;
  }
}

/**
 * get value from dictionary if not found set default value
 * @param fieldName 
 * @param defaultValue 
 * @param variable 
 */
export function getValue(fieldName: string, defaultValue: any, ...variable: any[]) {
  // variable.forEach( v => {
  //   if (v && !isNull(v[fieldName])) {
  //     return v[fieldName];
  //   }
  // });
  for (const v in variable) {
    if (variable[v] && !isNull(variable[v][fieldName])) {
      return variable[v][fieldName];
    }
  }
  return defaultValue;
}

