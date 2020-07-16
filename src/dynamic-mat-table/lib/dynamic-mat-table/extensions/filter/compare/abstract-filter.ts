export abstract class AbstractFilter<T = any> {
  public parameters?: [{value: T, text: string}];
  public type: 'and' | 'or';
  abstract selectedIndex: number;
  abstract readonly selectedValue: FilterOperation;
  abstract toString(dynamicVariable: any): string;
  abstract getOperations(): FilterOperation[];
  public hasValue() {
    if (this.parameters !== null) {
      return this.parameters.filter( p => p.value != null && p.value !== undefined && p.value.toString() !== '').length > 0;
    }
  }
}

export  interface FilterOperation {
  predicate: string;
  text: string;
}
