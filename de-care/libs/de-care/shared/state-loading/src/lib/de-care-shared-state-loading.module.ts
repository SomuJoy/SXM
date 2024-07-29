import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from './state/reducer';

@NgModule({
    imports: [StoreModule.forFeature(featureKey, reducer)]
})
export class DeCareSharedStateLoadingModule {}
