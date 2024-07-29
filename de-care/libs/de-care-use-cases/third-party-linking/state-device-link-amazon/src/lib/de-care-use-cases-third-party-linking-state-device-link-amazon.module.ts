import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from './state/reducer';
import { DomainsUtilityStateEnvironmentInfoModule } from '@de-care/domains/utility/state-environment-info';
import { EffectsModule } from '@ngrx/effects';
import { BuildAmazonUriEffect } from './state/build-amazon-uri.effect';

@NgModule({
    imports: [StoreModule.forFeature(featureKey, reducer), EffectsModule.forFeature([BuildAmazonUriEffect]), DomainsUtilityStateEnvironmentInfoModule]
})
export class DeCareUseCasesThirdPartyLinkingStateDeviceLinkAmazonModule {}
