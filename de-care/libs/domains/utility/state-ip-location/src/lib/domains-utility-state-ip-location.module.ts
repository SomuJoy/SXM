import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { stateIpLocationFeatureKey, stateIpLocationReducer } from './state/reducer';
import { GetProvinceFromCurrentIpWorkflowService } from './workflows/get-province-from-current-ip-workflow.service';

@NgModule({
    imports: [StoreModule.forFeature(stateIpLocationFeatureKey, stateIpLocationReducer)],
    providers: [GetProvinceFromCurrentIpWorkflowService],
})
export class DomainsUtilityStateIpLocationModule {}
