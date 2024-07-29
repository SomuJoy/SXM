import { InjectionToken } from '@angular/core';
import { CommonCreditCardTypeIdentifierService } from './common-credit-card-type-identifier.service';

export interface CreditCardTypeInfo {
    type: CreditCardTypes;
    length: number[];
    format: RegExp;
    isGiftCard: boolean;
}
export interface CreditCardTypeIdentifier {
    identifyType: (value: Readonly<string>) => CreditCardTypeInfo;
    getCardNumberFormatted: (value: Readonly<string>) => string;
}
export type CreditCardTypes = 'amex' | 'mastercard' | 'visa' | 'discover' | 'jcb' | 'diners' | 'unionpay' | string | null;

export const CREDIT_CARD_TYPE_IDENTIFIER = new InjectionToken<CreditCardTypeIdentifier>('CreditCardTypeIdentifier', {
    providedIn: 'root',
    factory: () => new CommonCreditCardTypeIdentifierService(),
});
