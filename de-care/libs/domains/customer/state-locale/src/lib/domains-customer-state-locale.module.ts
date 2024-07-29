import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CustomerLocaleEffects } from './state/effects';
import { customerLocaleFeatureKey, getCustomerLocationReducer } from './state/reducer';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        StoreModule.forFeature(customerLocaleFeatureKey, getCustomerLocationReducer),
        EffectsModule.forFeature([CustomerLocaleEffects])
    ]
})
export class DomainsCustomerStateLocaleModule {
    constructor(private readonly _translateService: TranslateService) {
        [
            { lang: 'en-CA', resource: require('./i18n/country-subdivisions.en-CA.json') },
            { lang: 'en-US', resource: require('./i18n/country-subdivisions.en-US.json') },
            { lang: 'fr-CA', resource: require('./i18n/country-subdivisions.fr-CA.json') }
        ].forEach(res => this._translateService.setTranslation(res.lang, res.resource, true));
    }
}
