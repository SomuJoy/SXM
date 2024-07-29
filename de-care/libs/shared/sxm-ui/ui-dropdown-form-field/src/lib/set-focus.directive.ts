import { Directive, Input, ElementRef } from '@angular/core';
import { timer } from 'rxjs';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[appSetFocus]'
})
export class SetFocusDirective {
    private _focused = false;

    @Input('appSetFocus')
    set focused(focused: boolean) {
        this._focused = focused;
        this.setFocus();
    }

    get focused() {
        return this._focused;
    }

    constructor(public element: ElementRef<HTMLElement>) {}

    setFocus() {
        if (this.focused) {
            timer(1).subscribe(() => this.element.nativeElement.focus());
        }
    }
}
