import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "upper-case",
})
export class UpperCasePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return null;
  }
}
