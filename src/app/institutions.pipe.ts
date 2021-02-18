import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'institutions'
})
export class InstitutionsPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
