import { Pipe, PipeTransform } from '@angular/core';
import { PackageData } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { OfferOptionPackageData } from '../offer-card-form-field-option/offer-card-form-field-option.component';

// Note: this Pipe is to temporarily handle mapping the package data to the interface used
//       for the primary-package-card which is used in other places so we want to minimize
//       the change impact at this time (we'll let the primary-package-card be as-is and
//       we can use this Pipe to map the current package data structure to the old)
@Pipe({ name: 'toLegacyPackageDataForPrimaryPackageCard' })
export class ToLegacyPackageDataForPrimaryPackageCard implements PipeTransform {
    transform({ highlightsText, packageName, ...packageData }: OfferOptionPackageData): PackageData {
        return {
            ...packageData,
            platformPlan: packageName,
            details: highlightsText
        };
    }
}
