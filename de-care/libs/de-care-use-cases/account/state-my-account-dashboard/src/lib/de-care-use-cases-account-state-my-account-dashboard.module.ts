import { NgModule, Inject } from '@angular/core';
import { DomainsCmsStateContentGroupsModule } from '@de-care/domains/cms/state-content-groups';
import { StoreModule, Store } from '@ngrx/store';
import { featureKey, reducer } from './state/reducer';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { setHideTrending } from './state/actions';

@NgModule({
    imports: [StoreModule.forFeature(featureKey, reducer), DomainsCmsStateContentGroupsModule],
})
export class DeCareUseCasesAccountStateMyAccountDashboardModule {
    constructor(private readonly _store: Store, @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken) {
        this._store.dispatch(setHideTrending({ hideTrending: this._countrySettings?.countryCode?.toLowerCase() === 'ca' }));
    }
}
