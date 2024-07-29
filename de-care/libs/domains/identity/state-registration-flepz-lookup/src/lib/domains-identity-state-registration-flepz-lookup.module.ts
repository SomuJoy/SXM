import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { Effects } from './state/effects';
import { registrationFlepzLookupFeatureKey, getRegistrationFlepzLookupReducer } from './state/reducer';

@NgModule({
    imports: [StoreModule.forFeature(registrationFlepzLookupFeatureKey, getRegistrationFlepzLookupReducer), EffectsModule.forFeature([Effects])],
})
export class DomainsIdentityStateRegistrationFlepzLookupModule {}
