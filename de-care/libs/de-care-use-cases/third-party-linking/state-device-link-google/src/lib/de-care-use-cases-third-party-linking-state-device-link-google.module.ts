import { NgModule } from '@angular/core';
import { DomainsUtilityStateEnvironmentInfoModule } from '@de-care/domains/utility/state-environment-info';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from './state/reducer';

@NgModule({
    imports: [StoreModule.forFeature(featureKey, reducer), DomainsUtilityStateEnvironmentInfoModule],
})
export class DeCareUseCasesThirdPartyLinkingStateDeviceLinkGoogleModule {}
