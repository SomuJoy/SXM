import { Directive, HostListener, HostBinding, Input, Output, EventEmitter, Inject } from '@angular/core';
import { CreditCardTypeNames, CardTypeEnum, CardTypeInterface, CardTypesConstant as cardTypesList, BinRangesToken, CardBinRanges } from '@de-care/shared/validation';
import { CreditCardHelper } from './credit-card-helper.class';

@Directive({
    selector: 'input[type="text"][sxmCreditCardType]',
})
export class CreditCardTypeDirective {
    private _cardType: CreditCardTypeNames;

    // NOTE: the parameter of an object type is used here to keep Angular from rendering the passed
    //       in cc number in the DOM (unfortunately, when the value bound in the template is a primitive
    //       Angular renders that value in the attribute).
    @Input() set sxmCreditCardType({ cardNumber }: { cardNumber: string }) {
        this.setCardType(cardNumber);
    }
    @Output() cardEntryEvent: EventEmitter<any> = new EventEmitter<any>();

    constructor(@Inject(BinRangesToken) private readonly _cardBinRanges: CardBinRanges) {}

    private emitCardEntryEvent() {
        const foundCards: CardTypeInterface[] = cardTypesList.filter((cardType: CardTypeInterface) => {
            return cardType.type === this._cardType;
        });
        this.cardEntryEvent.emit({ isGiftCard: foundCards && foundCards.length > 0 && foundCards[0].isGiftCard });
    }

    private setCardType(cardNumber: string) {
        this._cardType = CreditCardHelper.cardTypeUsingBinRanges(cardNumber, this._cardBinRanges.binRanges);
        this.emitCardEntryEvent();
    }

    @HostBinding('class.cc-mc') get mastercard(): boolean {
        return this._cardType === CardTypeEnum.Mastercard_CreditCard;
    }
    @HostBinding('class.cc-visa') get visa() {
        return this._cardType === CardTypeEnum.Visa_CreditCard;
    }
    @HostBinding('class.cc-discover') get discover() {
        return this._cardType === CardTypeEnum.Discover_CreditCard;
    }
    @HostBinding('class.cc-amex') get amex() {
        return this._cardType === CardTypeEnum.Amex_CreditCard;
    }
    @HostBinding('class.cc-dci') get diners() {
        return this._cardType === CardTypeEnum.Diners_CreditCard;
    }
    @HostBinding('class.cc-jcb') get jcb() {
        return this._cardType === CardTypeEnum.JCB_CreditCard;
    }
    @HostBinding('class.cc-unionpay') get unionpay() {
        return this._cardType === CardTypeEnum.UnionPay_CreditCard;
    }

    @HostListener('keyup', ['$event']) onkeyup(event: KeyboardEvent) {
        // NOTE: We need to check on keyup instead of using NgControl.valueChanges as the form field
        //       could be configured to emit changes on blur. We want this directive to update the css
        //       class as soon as the field value changes.
        const cardNumber = (event.target as HTMLInputElement).value;
        this.setCardType(cardNumber);
    }
}
