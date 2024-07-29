import { Pipe, PipeTransform } from '@angular/core';
import { PackageInfo } from '@de-care/purchase-state';
import { isOfferMCP, PlanTypeEnum } from '@de-care/data-services';

@Pipe({
    name: 'priceDifference'
})
export class PriceDifferencePipe implements PipeTransform {
    transform(offer: PackageInfo | any, upgradeOffer: PackageInfo, type: string | PlanTypeEnum) {
        if (isOfferMCP(type as PlanTypeEnum)) {
            return (
                upgradeOffer.pricePerMonth * upgradeOffer.termLength +
                ((offer.termLength - upgradeOffer.termLength) * offer.retailPrice - offer.pricePerMonth * offer.termLength)
            );
        } else {
            return upgradeOffer.price + ((offer.termLength - upgradeOffer.termLength) * offer.retailPrice - offer.price);
        }
    }
}
