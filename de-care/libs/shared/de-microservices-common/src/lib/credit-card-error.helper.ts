const ccFailurePropKeys = Object.freeze([
    'error.purchase.service.credit.card.validation.failed',
    'error.purchase.service.paymentinfo.required.paymentInfo',
    'error.purchase.service.no.creditcard.on.account',
    'error.purchase.service.ccinfo.required.cardInfo',
    'error.purchase.service.creditcard.fraud.reject'
]);

export function isCreditCardError(status: number, errorPropKey: string): boolean {
    return (status === 400 || status === 500) && ccFailurePropKeys.indexOf(errorPropKey) > -1;
}
