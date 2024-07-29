import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { streamingFlepzLookupFeatureKey, getStreamingFlepzLookupReducer } from './state/reducer';

@NgModule({
    imports: [StoreModule.forFeature(streamingFlepzLookupFeatureKey, getStreamingFlepzLookupReducer)]
})
export class DomainsIdentityStateStreamingFlepzLookupModule {}
