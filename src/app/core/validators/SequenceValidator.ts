import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[sequenceValidator]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: SequenceValidatorDirective,
      multi: true,
    },
  ],
})
export class SequenceValidatorDirective implements Validator {
  @Input() separators: RegExp | string = /,/gi;
  @Input() maxSize: number = 100;
  validate(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value;
    const list = (value || '').split(this.separators);
    if (list.length > this.maxSize) {
      return { sequence: 'Sequence is too long!' };
    }
    for (let item of list) {
      if (!Number.isInteger(+item.trim())) {
        return { sequence: 'Only integers in list' };
      }
    }

    return null;
  }
}
