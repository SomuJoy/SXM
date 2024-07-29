import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { DeCareUseCasesTrialActivationRtpStateSharedModule, setProvinceFromIpLocationInfo } from '@de-care/de-care-use-cases/trial-activation/rtp/state-shared';

@NgModule({
    imports: [
        CommonModule,
        DeCareUseCasesTrialActivationRtpStateSharedModule,
        RouterModule.forChild([
            {
                path: '',
                loadChildren: () =>
                    import('@de-care/de-care-use-cases/trial-activation/rtp/feature-create-account').then(m => m.DeCareUseCasesTrialActivationRtpFeatureCreateAccountModule)
            },
            {
                path: 'review',
                loadChildren: () => import('@de-care/de-care-use-cases/trial-activation/rtp/feature-review').then(m => m.DeCareUseCasesTrialActivationRtpFeatureReviewModule)
            },
            {
                path: 'thanks',
                loadChildren: () =>
                    import('@de-care/de-care-use-cases/trial-activation/rtp/feature-confirmation').then(m => m.DeCareUseCasesTrialActivationRtpFeatureConfirmationModule)
            }
        ])
    ]
})
export class DeCareUseCasesTrialActivationRtpMainModule {
    constructor(private readonly _store: Store) {
        this._store.dispatch(setProvinceFromIpLocationInfo({}));
    }
}
