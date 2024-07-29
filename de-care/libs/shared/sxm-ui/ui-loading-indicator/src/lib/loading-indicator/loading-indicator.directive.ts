import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[sxm-loading-indicator]'
})
export class SxmLoadingIndicatorDirective {
    constructor(el: ElementRef) {
        if (!el.nativeElement.className || el.nativeElement.className.length === 0) {
            el.nativeElement.className = 'button primary align-center text-center text-uppercase align-justify full-width';
        }
    }
}
