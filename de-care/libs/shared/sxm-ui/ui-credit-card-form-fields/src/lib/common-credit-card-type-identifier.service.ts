import { Injectable } from '@angular/core';
import { CreditCardTypeIdentifier, CreditCardTypeInfo, CreditCardTypes } from './tokens';

@Injectable({ providedIn: 'root' })
export class CommonCreditCardTypeIdentifierService implements CreditCardTypeIdentifier {
    identifyType(value: Readonly<string>): CreditCardTypeInfo {
        return getCardType(value);
    }

    getCardNumberFormatted(value: Readonly<string>) {
        const typeInfo = this.identifyType(value);
        if (!typeInfo) {
            return value;
        }
        return formatCardNumber(value, typeInfo);
    }
}

const _defaultFormat = /(\d{1,4})/g;
// NOTE: order matters here due to the logic in getCardType...might want to update getCardType logic to not require this array ordering
const cardTypes: { type: CreditCardTypes; patterns: number[]; isGiftCard?: boolean; length: number[]; format: RegExp }[] = [
    { type: 'blackhawkgiftcard', patterns: [4436135021], isGiftCard: true, length: [16], format: _defaultFormat },
    { type: 'visa', patterns: [4], length: [13, 16, 19], format: _defaultFormat },
    { type: 'mastercard', patterns: [51, 52, 53, 54, 55, 22, 23, 24, 25, 26, 27], length: [16], format: _defaultFormat },
    { type: 'amex', patterns: [34, 37], length: [15], format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/ },
    { type: 'diners', patterns: [30, 36, 38, 39], length: [14], format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/ },
    { type: 'discover', patterns: [60, 64, 65, 622], length: [16], format: _defaultFormat },
    { type: 'unionpay', patterns: [62, 81], length: [16], format: _defaultFormat },
    { type: 'jcb', patterns: [35], length: [16, 19], format: _defaultFormat },
];

function getCardType(value: Readonly<string>): CreditCardTypeInfo {
    let card, p, pattern;
    const num = (value + '').replace(/\D/g, '');
    for (let i = 0, len = cardTypes.length; i < len; i++) {
        card = cardTypes[i];
        const { patterns, ...cardTypeInfo } = card;
        for (let j = 0, len1 = patterns.length; j < len1; j++) {
            pattern = patterns[j];
            p = pattern + '';
            if (num.substr(0, p.length) === p) {
                return cardTypeInfo;
            }
        }
    }
    return null;
}

function formatCardNumber(value, { length, format }) {
    let groups;
    let num = value.replace(/\D/g, '');
    num = num.slice(0, length[length.length - 1]);
    if (format.global) {
        const matches = num.match(format);
        if (matches != null) {
            return matches.join(' ');
        }
    } else {
        groups = format.exec(num);
        if (groups == null) {
            return;
        }
        groups.shift();
        return groups.filter(Boolean).join(' ');
    }
}
