import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { PackageDescriptionModel } from '@de-care/domains/offers/state-package-descriptions';
import { PackageDescriptionTranslatePipeBase } from '../package-description-translate-pipe-base';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { offerTypeIsAdvantage } from '@de-care/domains/offers/state-offers';

@Pipe({
    name: 'translateIsAdvantageOffer',
    pure: true
})
export class TranslateOfferIsAdvantagePipe implements PipeTransform {
    protected readonly _translatePipe: TranslatePipe;
    
    constructor(translateService: TranslateService, changeDetectorRef: ChangeDetectorRef) {
        this._translatePipe = new TranslatePipe(translateService, changeDetectorRef);
    }

    transform({ type, advantage, isAdvantage }: { type?: string; advantage?: boolean, isAdvantage?: boolean }): any {
        return advantage || isAdvantage || (type && offerTypeIsAdvantage(type));
    }

}
