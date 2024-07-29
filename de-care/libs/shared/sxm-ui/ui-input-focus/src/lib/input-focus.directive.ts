import { Directive, ElementRef, HostListener, Renderer2, Optional, Host, OnDestroy, AfterContentInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter, map, pairwise, startWith } from 'rxjs/operators';

@Directive({
    selector: '[onFocus]',
})
export class InputFocusDirective implements OnDestroy, AfterContentInit {
    private AUTOFILLED = 'is-autofilled';
    private _valueSubscription: Subscription;

    constructor(private _el: ElementRef, public renderer: Renderer2, @Optional() @Host() private readonly _ngControl: NgControl) {}

    ngAfterContentInit() {
        // NOTE: We really want to move away from this directive being coupled with parent element implementation.
        //       This is being done to add a CSS class to support form field label masking UX implementation.
        //       We should be encapsulating this within sxm-ui components designed for form field implementation that
        //       would come with the form field, label and parent and handle all this implementation.
        //       But...for now we need to continue to support this. So the below handles wiring up to value changes
        //       when this directive is used on a form field and adds/removes a CSS filled class to the parent element.
        if (!!this._ngControl?.value || this._el?.nativeElement?.value) {
            this.renderer.addClass(this._el.nativeElement.parentElement, 'filled');
        }
        if (this._ngControl?.valueChanges) {
            this._valueSubscription = this._ngControl.valueChanges
                .pipe(
                    startWith(<Object>this._ngControl.value),
                    pairwise(),
                    // normalize the values to remove any extra white space (to remove false positives for empty)
                    map(([previous, change]) => {
                        if (typeof previous === 'string' || previous instanceof String) {
                            previous = previous?.trim();
                        }
                        if (typeof change === 'string' || change instanceof String) {
                            change = change?.trim();
                        }
                        return [previous, change];
                    }),
                    // only do stuff if the value is going from no value (empty) to some value
                    filter(([previous, change]) => (previous && !change) || (!previous && change)),
                    // we only care about the new value after this point so let's map down to that
                    map(([_, value]) => value)
                )
                .subscribe((value) => {
                    if (!!value) {
                        this.renderer.addClass(this._el.nativeElement.parentElement, 'filled');
                    } else {
                        this.renderer.removeClass(this._el.nativeElement.parentElement, 'filled');
                    }
                });
        }
    }

    ngOnDestroy() {
        if (this._valueSubscription) {
            this._valueSubscription.unsubscribe();
        }
    }

    @HostListener('focus', ['$event']) onFocus(e) {
        this._el.nativeElement.parentElement.style.boxShadow = 'none';
        this.renderer.addClass(this._el.nativeElement.parentElement, 'active');
        return;
    }
    @HostListener('blur', ['$event']) onfocusout(e) {
        this.renderer.removeClass(this._el.nativeElement.parentElement, 'active');
        return;
    }
    @HostListener('animationstart', ['$event']) onAnimation(e) {
        const input = this._el.nativeElement;
        const label = this._el.nativeElement.previousElementSibling;

        const onAutoFillStart = () => {
            this.renderer.addClass(input, this.AUTOFILLED);
            this.renderer.addClass(label, this.AUTOFILLED);
        };
        const onAutoFillCancel = () => {
            this.renderer.removeClass(input, this.AUTOFILLED);
            this.renderer.removeClass(label, this.AUTOFILLED);
        };

        switch (e.animationName) {
            case 'onAutoFillStart':
                return onAutoFillStart();
            case 'onAutoFillCancel':
                return onAutoFillCancel();
            default:
                return;
        }
    }
}
