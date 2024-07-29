import { AfterViewInit, Directive, ElementRef, HostListener, Inject, OnDestroy, Optional, Self } from '@angular/core';
import { CREDIT_CARD_TYPE_IDENTIFIER, CreditCardTypeIdentifier } from './tokens';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { unmaskOnValueChange } from '@de-care/shared/forms/util-cva-connector';

@Directive({
    selector: 'input[type="text"][sxmUiCreditCardFormat]',
})
export class SxmUiMaskCreditCardDirective implements AfterViewInit, OnDestroy {
    private readonly _unmaskRegex = /[^0-9]/g;
    private _subscription: Subscription;

    @HostListener('input', ['$event']) onInput(inputEvent) {
        let value = inputEvent?.target?.value?.replace(this._unmaskRegex, '');
        value = this._creditCardTypeIdentifierService.getCardNumberFormatted(value);
        this._elementRef.nativeElement.value = value;
    }

    constructor(
        private readonly _elementRef: ElementRef,
        @Optional() @Self() private readonly _control: NgControl,
        @Inject(CREDIT_CARD_TYPE_IDENTIFIER) private readonly _creditCardTypeIdentifierService: CreditCardTypeIdentifier
    ) {}

    ngAfterViewInit() {
        if (this._control?.control?.valueChanges) {
            this._subscription = unmaskOnValueChange(this._control.control, this._unmaskRegex);
        }
    }

    ngOnDestroy() {
        this._subscription && this._subscription.unsubscribe();
    }
}
