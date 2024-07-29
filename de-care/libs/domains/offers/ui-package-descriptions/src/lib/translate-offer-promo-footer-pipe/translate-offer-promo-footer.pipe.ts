import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PackageDescriptionModel } from '@de-care/domains/offers/state-package-descriptions';
import { PackageDescriptionTranslatePipeBase } from '../package-description-translate-pipe-base';

@Pipe({
    name: 'translateOfferPromoFooter',
    pure: false
})
export class TranslateOfferPromoFooterPipe extends PackageDescriptionTranslatePipeBase implements PipeTransform {
    constructor(translateService: TranslateService, changeDetectorRef: ChangeDetectorRef) {
        super(translateService, changeDetectorRef);
    }

    getDescriptionContent(description: PackageDescriptionModel, type: string): string {
        if (Array.isArray(description.packageOverride) && description.packageOverride.find(i => i.type === type)) {
            return description.packageOverride.find(i => i.type === type).promoFooter;
        }
        return description.promoFooter;
    }
}
