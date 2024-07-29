import { Directive, EventEmitter, HostBinding, HostListener, Inject, Optional, Output, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { CREDIT_CARD_TYPE_IDENTIFIER, CreditCardTypeIdentifier, CreditCardTypes } from './tokens';

@Directive({
    selector: 'input[type="text"][sxmUiCreditCardType]',
})
export class CreditCardTypeDirective {
    private _cardType: CreditCardTypes;
    @Output() giftCardIdentified = new EventEmitter();
    @HostListener('input', ['$event']) onInput(inputEvent) {
        this._setCardType(inputEvent?.target?.value);
    }
    @HostListener('blur', ['$event']) onBlur(): void {
        this._control?.control?.markAsTouched();
    }
    @HostBinding('class.cc-mc') get mastercard(): boolean {
        return this._cardType === 'mastercard';
    }
    @HostBinding('class.cc-visa') get visa() {
        return this._cardType === 'visa';
    }
    @HostBinding('class.cc-discover') get discover() {
        return this._cardType === 'discover';
    }
    @HostBinding('class.cc-amex') get amex() {
        return this._cardType === 'amex';
    }
    @HostBinding('class.cc-dci') get diners() {
        return this._cardType === 'diners';
    }
    @HostBinding('class.cc-jcb') get jcb() {
        return this._cardType === 'jcb';
    }
    @HostBinding('class.cc-unionpay') get unionpay() {
        return this._cardType === 'unionpay';
    }

    constructor(
        @Optional() @Self() private readonly _control: NgControl,
        @Inject(CREDIT_CARD_TYPE_IDENTIFIER) private readonly _creditCardTypeIdentifierService: CreditCardTypeIdentifier
    ) {}

    private _setCardType(value: string) {
        const cardTypeInfo = this._creditCardTypeIdentifierService.identifyType(value);
        if (cardTypeInfo) {
            const { type, isGiftCard } = cardTypeInfo;
            this._cardType = type;
            if (isGiftCard) {
                this.giftCardIdentified.emit();
            }
        } else {
            this._cardType = null;
        }
    }
}
