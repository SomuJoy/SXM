import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SharedVerifyDeviceUserSelection, VerifyDeviceTabsComponent } from '@de-care/identification';
import { behaviorEventReactionRTCProactiveOrganicAccountLookupCompleted } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';

@Component({
    selector: 'find-your-account-card',
    templateUrl: './find-your-account-card.component.html',
    styleUrls: ['./find-your-account-card.component.scss']
})
export class FindYourAccountCardComponent {
    @ViewChild(VerifyDeviceTabsComponent) verifyDeviceTabsComponent: VerifyDeviceTabsComponent;

    @Output() accountRadioSelected = new EventEmitter();
    @Input()
    get questionsPhoneNumber(): string {
        return this._questionsPhoneNumber;
    }
    set questionsPhoneNumber(tfn: string) {
        this._questionsPhoneNumber = tfn?.trim();
    }
    private _questionsPhoneNumber: string;

    translateKeyPrefix = 'DeCareUseCasesRollToChoiceFeaturePlanChoiceOrganicModule.FindYourAccountCardComponent.';

    constructor(private readonly _store: Store) {}

    handleCloseAllModals() {
        this.verifyDeviceTabsComponent.completeYourInfoLoading();
        this.verifyDeviceTabsComponent.closeAllModals();
    }

    handleUserSelection(sharedVerifyDeviceUserSelection: SharedVerifyDeviceUserSelection) {
        this._store.dispatch(behaviorEventReactionRTCProactiveOrganicAccountLookupCompleted({ componentName: 'rtcLandingPage' }));
        this.accountRadioSelected.emit({
            radioId: sharedVerifyDeviceUserSelection.selectedRadio?.last4DigitsOfRadioId,
            accountNumber: sharedVerifyDeviceUserSelection.selectedAccountNumber
        });
    }
}
