import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface ReviewStepHeaderViewModel {
    firstDevice: any;
    secondDevice: any;
    firstRadioIsTrial: boolean;
    firstRadioIsClosed: boolean;
    bothRadiosHaveSameStatus: boolean;
}

@Component({
    selector: 'de-care-review-step-header',
    templateUrl: './review-step-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewStepHeaderComponent {
    @Input() viewModel: ReviewStepHeaderViewModel;
    @Input() isFrench: boolean;

    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureUpgradeVipModule.ReviewStepHeaderComponent';
}
