export class Utils {

  public static isNull(value: any) {
    if ( value === null || value === undefined) {
      return true;
    } else {
      return false;
    }
  }

  public static clone<T>(obj: any) {
    if ( obj === null) {
      return obj;
    } else if ( Array.isArray(obj)) {
      const array: T[] = [];
      obj.forEach( item => array.push( Object.assign({}, item)));
      return array;
    } else {
      return Object.assign({}, obj);
    }
  }

  public static deepClone<T>(obj: any) {
    if ( obj === null || obj === undefined) {
      return obj;
    } else if ( Array.isArray(obj)) {
      const array: T[] = [];
      obj.forEach( item => array.push( this.deepClone<typeof item>(item) ));
      return array as T[];
    } else {
      const c = Object.assign({} as T, obj);
      const fields: string[] = Object.getOwnPropertyNames(obj);
      fields.forEach( f => {
        const field = obj[f];
        if ( typeof field === 'object' ) {
          c[f] = this.deepClone<typeof field>(field);
        }
      });
      return Object.assign({}, obj);
    }
  }

}
