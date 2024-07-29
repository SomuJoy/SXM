import { Fee, FeesLabelEnum } from '../data-services/quote.interface';

export function extractQuoteFee(fees: Array<Fee>, feeLabel: FeesLabelEnum): number {
    let feeAmount: number = null;
    if (fees && feeLabel) {
        const feeObj: Fee = fees.find((feeLineItem: Fee) => {
            return feeLineItem.description === feeLabel;
        });
        if (feeObj) {
            feeAmount = Number(feeObj.amount);
        }
    }

    return feeAmount;
}
