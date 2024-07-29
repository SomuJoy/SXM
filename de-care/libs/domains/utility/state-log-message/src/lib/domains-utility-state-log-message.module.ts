import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { Effects } from './effects';

/**
 * @classdesc Note: this module has a dependency on StoreRouterConnectingModule
 */
@NgModule({
    imports: [EffectsModule.forFeature([Effects])],
})
export class DomainsUtilityStateLogMessageModule {}
