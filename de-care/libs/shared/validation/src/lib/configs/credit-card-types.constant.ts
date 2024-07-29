// ===============================================================================
export enum CardTypeEnum {
    Amex_CreditCard = 'AMEX',
    Mastercard_CreditCard = 'Mastercard',
    Visa_CreditCard = 'VISA',
    Discover_CreditCard = 'Discover',
    JCB_CreditCard = 'JCB',
    Diners_CreditCard = 'Diners',
    UnionPay_CreditCard = 'UnionPay',
    BH_GiftCard = 'BlackHawkGiftCard'
}

export enum CardBinTypeEnum {
    Undefined = '0',
    Amex_CreditCard = '1',
    Mastercard_CreditCard = '2',
    Visa_CreditCard = '3',
    Discover_CreditCard = '4',
    JCB_CreditCard = '5',
    Diners_CreditCard = '6',
    UnionPay_CreditCard = '7',
    BH_GiftCard = '8'
}

export interface CardTypeInterface {
    type: CardTypeEnum;
    binType: CardBinTypeEnum;
    isGiftCard: boolean;
    patterns: number[];
    format: RegExp;
    length: number[];
    cvvLength: number[];
    luhn: boolean;
}

// Immutable Variables
const _defaultFormat = /(\d{1,4})/g;

const _cardTypes: CardTypeInterface[] = [
    {
        type: CardTypeEnum.BH_GiftCard,
        binType: CardBinTypeEnum.BH_GiftCard,
        isGiftCard: true,
        patterns: [4436135021],
        format: _defaultFormat,
        length: [16],
        cvvLength: [3],
        luhn: true
    },
    {
        type: CardTypeEnum.Visa_CreditCard,
        binType: CardBinTypeEnum.Visa_CreditCard,
        isGiftCard: false,
        patterns: [4],
        format: _defaultFormat,
        length: [13, 16, 19],
        cvvLength: [3],
        luhn: true
    },
    {
        type: CardTypeEnum.Mastercard_CreditCard,
        binType: CardBinTypeEnum.Mastercard_CreditCard,
        isGiftCard: false,
        patterns: [51, 52, 53, 54, 55, 22, 23, 24, 25, 26, 27],
        format: _defaultFormat,
        length: [16],
        cvvLength: [3],
        luhn: true
    },
    {
        type: CardTypeEnum.Amex_CreditCard,
        binType: CardBinTypeEnum.Amex_CreditCard,
        isGiftCard: false,
        patterns: [34, 37],
        format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
        length: [15],
        cvvLength: [3, 4],
        luhn: true
    },
    {
        type: CardTypeEnum.Diners_CreditCard,
        binType: CardBinTypeEnum.Diners_CreditCard,
        isGiftCard: false,
        patterns: [30, 36, 38, 39],
        format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/,
        length: [14],
        cvvLength: [3],
        luhn: true
    },
    {
        type: CardTypeEnum.Discover_CreditCard,
        binType: CardBinTypeEnum.Discover_CreditCard,
        isGiftCard: false,
        patterns: [60, 64, 65, 622],
        format: _defaultFormat,
        length: [16],
        cvvLength: [3],
        luhn: true
    },
    {
        type: CardTypeEnum.UnionPay_CreditCard,
        binType: CardBinTypeEnum.UnionPay_CreditCard,
        isGiftCard: false,
        patterns: [62, 81],
        format: _defaultFormat,
        length: [16],
        cvvLength: [3],
        luhn: true
    },
    {
        type: CardTypeEnum.JCB_CreditCard,
        binType: CardBinTypeEnum.JCB_CreditCard,
        isGiftCard: false,
        patterns: [35],
        format: _defaultFormat,
        length: [16, 19],
        cvvLength: [3],
        luhn: true
    }
];

//********************************************************************************
// Constant (Checkout)
export const CardTypesConstant = _cardTypes;
export type CreditCardTypeNames =
    | 'Maestro'
    | 'Forbrugsforeningen'
    | 'Dankort'
    | 'Mastercard'
    | 'VISA'
    | 'Discover'
    | 'AMEX'
    | 'Diners'
    | 'UnionPay'
    | 'JCB'
    | 'BlackHawkGiftCard';
