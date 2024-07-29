import { CardTypesConstant as cardTypes } from '../configs/credit-card-types.constant';

export function getPaymentCardTypeFromNumber(cardNumber: number | string): string {
    let card, p, pattern, ref;
    const num = (cardNumber + '').replace(/\D/g, '');
    for (let i = 0, len = cardTypes.length; i < len; i++) {
        card = cardTypes[i];
        ref = card.patterns;

        for (let j = 0, len1 = ref.length; j < len1; j++) {
            pattern = ref[j];
            p = pattern + '';

            if (num.substr(0, p.length) === p) {
                return card.type;
            }
        }
    }
}
