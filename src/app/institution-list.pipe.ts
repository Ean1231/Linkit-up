import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'institutionList'
})
export class InstitutionListPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
