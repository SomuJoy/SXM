import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { PackageDescriptionModel } from '@de-care/domains/offers/state-package-descriptions';
import { PackageDescriptionTranslatePipeBase } from '../package-description-translate-pipe-base';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'translateOfferName',
    pure: false
})
export class TranslateOfferNamePipe extends PackageDescriptionTranslatePipeBase implements PipeTransform {
    constructor(translateService: TranslateService, changeDetectorRef: ChangeDetectorRef) {
        super(translateService, changeDetectorRef);
    }

    getDescriptionContent(description: PackageDescriptionModel, type: string): string {
        if (Array.isArray(description.packageOverride) && description.packageOverride.find(i => i.type === type)) {
            return description.packageOverride.find(i => i.type === type).name;
        }
        return description.name;
    }
}
