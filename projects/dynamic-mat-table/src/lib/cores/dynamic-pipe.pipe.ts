import { Injector, Pipe, PipeTransform, Type } from "@angular/core";
import { IPipe } from "../models/pipe.model";

@Pipe({
  name: "dynamicPipe",
})
export class DynamicPipe implements PipeTransform {
  public constructor(private injector: Injector) {}

  transform(value: any, pipes: IPipe[]): any {
    if (!pipes && pipes.length > 0) {
      pipes.forEach((pipe: IPipe) => {
        const _pipe = this.injector.get(pipe.token);
        value = _pipe.transform(value, ...pipe.data);
      });
    }
    return value;
  }
}
