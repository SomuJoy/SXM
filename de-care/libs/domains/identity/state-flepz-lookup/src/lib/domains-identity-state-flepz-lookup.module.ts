import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { flepzLookupFeatureKey, getFlepzLookupReducer } from './state/reducer';

@NgModule({
    imports: [StoreModule.forFeature(flepzLookupFeatureKey, getFlepzLookupReducer)]
})
export class DomainsIdentityStateFlepzLookupModule {}
