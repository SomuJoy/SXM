import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    // eslint-disable-next-line
    selector: '[appMaskedRadioId]',
})
export class SxmUiMaskRadioIdDirective {
    constructor(public ngControl: NgControl) {}
    readonly maxLength = 12;
    readonly maskedLength = 4;

    @HostListener('ngModelChange', ['$event'])
    onModelChange(event) {
        this.onInputChange(event);
    }

    onInputChange(event) {
        let newVal = event.replace(/[^a-z0-9]/gi, '');
        if (newVal?.length <= this.maxLength) {
            newVal = newVal?.length <= this.maskedLength && newVal?.length > 0 ? '****' + newVal : newVal;
        }
        newVal = newVal ? newVal.split('-').join('').trim() : newVal;
        newVal = newVal?.slice(0, this.maxLength);
        this.ngControl.valueAccessor.writeValue(newVal?.toUpperCase());
    }
}
