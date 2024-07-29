import { AfterViewInit, Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { getConfirmationPageViewModel, getIsClosedRadio, SubmitAccountRegistrationWorkflowService } from '@de-care/de-care-use-cases/checkout/state-satellite';
import { RegisterCredentialsState } from '@de-care/domains/account/ui-register';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { PrintService } from '@de-care/shared/browser-common/window-print';

@Component({
    selector: 'confirmation-page',
    templateUrl: './confirmation-page.component.html',
    styleUrls: ['./confirmation-page.component.scss'],
})
export class ConfirmationPageComponent implements AfterViewInit {
    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureSatelliteModule.ConfirmationPageComponent.';
    confirmationViewModel$ = this._store.select(getConfirmationPageViewModel);
    registerCredentialsState = RegisterCredentialsState.PasswordOnly;
    registrationCompleted$ = new BehaviorSubject(false);
    isClosedRadio$ = this._store.select(getIsClosedRadio);
    constructor(
        private readonly _store: Store,
        private _printService: PrintService,
        private readonly _submitAccountRegistrationWorkflowService: SubmitAccountRegistrationWorkflowService,
        @Inject(DOCUMENT) document: Document
    ) {
        document.body.scrollTop = 0;
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'confirmation' }));
    }

    onRegisterAccount(registerData) {
        this._submitAccountRegistrationWorkflowService.build(registerData).subscribe({
            next: () => {
                this.registrationCompleted$.next(true);
            },
            error: () => {
                // TODO: show system error
            },
        });
    }

    onPrintClick(): void {
        this._printService.print();
    }
}
