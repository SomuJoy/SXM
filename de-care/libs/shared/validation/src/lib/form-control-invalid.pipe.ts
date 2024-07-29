import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
    name: 'formControlInvalid',
    pure: false
})
export class FormControlInvalidPipe implements PipeTransform {
    transform(control: AbstractControl, ...args: boolean[]): any {
        if (args && args.length > 0) {
            return control.invalid && (control.dirty || control.touched || !args.some(i => i === false));
        } else {
            return control.invalid && (control.dirty || control.touched);
        }
    }
}
