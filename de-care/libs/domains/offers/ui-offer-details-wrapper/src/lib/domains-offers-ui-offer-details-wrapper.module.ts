import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferDetailsWrapperComponent } from './offer-details-wrapper/offer-details-wrapper.component';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild()],
    declarations: [OfferDetailsWrapperComponent],
    exports: [OfferDetailsWrapperComponent]
})
export class DomainsOffersUiOfferDetailsWrapperModule {
    constructor(private readonly _translateService: TranslateService) {
        [
            { lang: 'en-CA', resource: require('./i18n/offer-details-wrapper.en-CA.json') },
            { lang: 'en-US', resource: require('./i18n/offer-details-wrapper.en-US.json') },
            { lang: 'fr-CA', resource: require('./i18n/offer-details-wrapper.fr-CA.json') }
        ].forEach(res => this._translateService.setTranslation(res.lang, res.resource, true));
    }
}
