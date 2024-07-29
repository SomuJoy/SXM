import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    // eslint-disable-next-line
    selector: '[appTrimmedRadioId]',
})
export class SxmUiTrimmedRadioIdDirective {
    constructor(public ngControl: NgControl) {}
    readonly maxLength = 17; //Field accomodates RID & VIN

    @HostListener('ngModelChange', ['$event'])
    onModelChange(event) {
        this.onInputChange(event);
    }

    onInputChange(event) {
        let newVal = event.replace(/[^a-z0-9]/gi, '');
        newVal = newVal ? newVal.split('-').join('').trim() : newVal;
        newVal = newVal?.slice(0, this.maxLength);
        this.ngControl.valueAccessor.writeValue(newVal?.toUpperCase());
    }
}
