import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'sxm-ui-pick-a-plan-form',
    templateUrl: 'pick-a-plan-form.component.html',
    styleUrls: ['pick-a-plan-form.component.scss'],
})
export class SxmUiPickAPlanFormComponent {
    translateKeyPrefix = 'SharedSxmUiUiPickAPlanFormModule.SxmUiPickAPlanFormComponent';

    constructor() {}

    @Input() showChoiceNotAvailableError$;
    @Input() availableOffers$;
    @Input() packageNames$;
    @Input() containsChoicePackages$;
    @Input() retailPrices$;
    @Input() planComparisonGridParams$;
    @Input() data;
    @Input() authenticatedCustomer;
    @Input() selectedPackageIndex;
    @Input() currentOrExpiredTrialPackage;
    @Input() activateExpandable = true;

    @Output() continueToCheckout = new EventEmitter();
    @Output() packageNameSelected = new EventEmitter<string>();
    @Output() packageIndexSelected = new EventEmitter<number>();

    onSelectedPackageName(packageName: string) {
        this.packageNameSelected.emit(packageName);
    }

    onSelectedPackageIndex(packageIndex: number) {
        this.selectedPackageIndex = packageIndex;
        this.packageIndexSelected.emit(packageIndex);
    }

    onPlanComparisonContinue() {
        this.continueToCheckout.emit();
    }
}
