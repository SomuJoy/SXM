// ===============================================================================
// Internal Features (Shared)
import { CardTypesConstant as cardTypes, CreditCardTypeNames, CardBinTypeEnum, CardTypeInterface } from '@de-care/shared/validation';

interface BinRangeModel {
    name: string;
    type: string;
    priority: number;
    regex: string;
}

//********************************************************************************
// TODO: Eventually change this to not have static methods so it can be constructor injected for use
//       and can be mocked for testing.
export class CreditCardHelper {
    //================================================
    //===             Static Functions             ===
    //================================================
    public static cards() {
        return cardTypes;
    }

    public static cardTypeUsingBinRanges(num, binRanges: BinRangeModel[]): CreditCardTypeNames | null {
        if (!num) {
            return null;
        }

        const card = this.cardFromNumberUsingBinRanges(num, binRanges);

        if (card) {
            return card.type;
        }

        return this.cardType(num);
    }

    public static cardFromNumberUsingBinRanges(num, binRanges: BinRangeModel[]) {
        let card, binIdx;
        num = (num + '').replace(/\D/g, '');

        for (let i = 0, len = binRanges.length; i < len; i++) {
            if (binRanges[i].regex && num && num.match(binRanges[i].regex)) {
                binIdx = i;
                break;
            }
        }
        if (binIdx) {
            for (let i = 0, len = cardTypes.length; i < len; i++) {
                card = cardTypes[i];
                if (cardTypes[i].binType === binRanges[binIdx].type) {
                    return card;
                }
            }
        }

        return this.cardFromNumber(num, binRanges);
    }

    public static cardFromNumber(num, binRanges?: BinRangeModel[]) {
        let card, p, pattern, ref;
        num = (num + '').replace(/\D/g, '');

        if (binRanges && binRanges.length > 0) {
            for (let i = 0, len = binRanges.length; i < len; i++) {
                if (binRanges[i].type !== CardBinTypeEnum.Undefined) {
                    const foundCardType: CardTypeInterface[] = cardTypes.filter((cardType: CardTypeInterface) => {
                        return cardType.binType === binRanges[i].type;
                    });

                    if (foundCardType && foundCardType.length > 0) {
                        card = foundCardType[0];
                        ref = card.patterns;

                        for (let j = 0, len1 = ref.length; j < len1; j++) {
                            pattern = ref[j];
                            p = pattern + '';

                            if (num.substr(0, p.length) === p) {
                                return card;
                            }
                        }
                    }
                }
            }
        } else {
            for (let i = 0, len = cardTypes.length; i < len; i++) {
                card = cardTypes[i];
                ref = card.patterns;

                for (let j = 0, len1 = ref.length; j < len1; j++) {
                    pattern = ref[j];
                    p = pattern + '';

                    if (num.substr(0, p.length) === p) {
                        return card;
                    }
                }
            }
        }
    }

    public static restrictNumeric(e): boolean {
        let input;

        if (e.metaKey || e.ctrlKey) {
            return true;
        } else if (e.which === 32) {
            return false;
        } else if (e.which === 0) {
            return true;
        } else if (e.which < 33) {
            return true;
        }

        input = String.fromCharCode(e.which);

        return !!/[\d\s]/.test(input);
    }

    public static hasTextSelected(target) {
        return target.selectionStart !== null && target.selectionStart !== target.selectionEnd;
    }

    public static cardType(num: string): CreditCardTypeNames | null {
        if (!num) {
            return null;
        }

        const card = this.cardFromNumber(num);

        if (card !== null && typeof card !== 'undefined') {
            return card.type;
        }

        return null;
    }

    public static formatCardNumber(num, binRanges?: BinRangeModel[]): string {
        let card, groups, upperLength;

        num = num.replace(/\D/g, '');
        card = this.cardFromNumber(num, binRanges);

        if (!card) {
            return num;
        }

        upperLength = card.length[card.length.length - 1];
        num = num.slice(0, upperLength);

        if (card.format.global) {
            const matches = num.match(card.format);

            if (matches != null) {
                return matches.join(' ');
            }
        } else {
            groups = card.format.exec(num);
            if (groups == null) {
                return;
            }

            groups.shift();

            return groups.filter(Boolean).join(' ');
        }
    }

    public static isCardNumber(key, target) {
        let card, digit, value, result;

        digit = String.fromCharCode(key);

        if (!/^\d+$/.test(digit)) {
            return false;
        }

        if (CreditCardHelper.hasTextSelected(target)) {
            return true;
        }

        value = (target.value + digit).replace(/\D/g, '');
        card = CreditCardHelper.cardFromNumber(value);

        if (card) {
            result = value.length <= card.length[card.length.length - 1];
        } else {
            result = value.length <= 16;
        }

        return result;
    }

    public static restrictExpiry(key, target) {
        let digit, value;

        digit = String.fromCharCode(key);

        if (!/^\d+$/.test(digit) || this.hasTextSelected(target)) {
            return false;
        }

        value = `${target.value}${digit}`.replace(/\D/g, '');

        return value.length > 6;
    }

    public static replaceFullWidthChars(str) {
        if (str === null) {
            str = '';
        }

        let chr,
            idx,
            value = '';

        const fullWidth = '\uff10\uff11\uff12\uff13\uff14\uff15\uff16\uff17\uff18\uff19',
            halfWidth = '0123456789',
            chars = str.split('');

        for (let i = 0; i < chars.length; i++) {
            chr = chars[i];
            idx = fullWidth.indexOf(chr);

            if (idx > -1) {
                chr = halfWidth[idx];
            }

            value += chr;
        }

        return value;
    }

    public static formatExpiry(expiry) {
        const parts = expiry.match(/^\D*(\d{1,2})(\D+)?(\d{1,4})?/);
        let mon, sep, year;

        if (!parts) {
            return '';
        }

        mon = parts[1] || '';
        sep = parts[2] || '';
        year = parts[3] || '';

        if (year.length > 0) {
            sep = '/';
        } else if (sep === ' /') {
            mon = mon.substring(0, 1);
            sep = '';
        } else if (mon.length === 2 || sep.length > 0) {
            sep = '/';
        } else if (mon.length === 1 && mon !== '0' && mon !== '1') {
            mon = `0${mon}`;
            sep = '/';
        }

        return `${mon}${sep}${year}`;
    }

    public static restrictCvc(key, target) {
        const digit = String.fromCharCode(key);

        if (!/^\d+$/.test(digit) || this.hasTextSelected(target)) {
            return false;
        }

        const val = `${target.value}${digit}`;

        return val.length <= 4;
    }

    public static luhnCheck(num) {
        let digit,
            odd = true,
            sum = 0;

        const digits = num.split('').reverse();

        for (let i = 0; i < digits.length; i++) {
            digit = digits[i];
            digit = parseInt(digit, 10);

            if ((odd = !odd)) {
                digit *= 2;
            }

            if (digit > 9) {
                digit -= 9;
            }

            sum += digit;
        }

        return sum % 10 === 0;
    }
}
