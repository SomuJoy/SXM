import { AfterViewInit, Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
    getConfirmationPageViewModel,
    getRadioInfoForSelectedDeviceViewModel,
    SubmitAccountRegistrationWorkflowService,
} from '@de-care/de-care-use-cases/checkout/state-upgrade';
import { RegisterCredentialsState } from '@de-care/domains/account/ui-register';
import { BehaviorSubject } from 'rxjs';
import { PrintService } from '@de-care/shared/browser-common/window-print';
import { DOCUMENT } from '@angular/common';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { filter, map } from 'rxjs/operators';

@Component({
    selector: 'de-care-tier-up-confirmation-page',
    templateUrl: './tier-up-confirmation-page.component.html',
    styleUrls: ['./tier-up-confirmation-page.component.scss'],
})
export class TierUpConfirmationPageComponent implements AfterViewInit {
    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureUpgradeModule.TierUpConfirmationPageComponent.';
    confirmationViewModel$ = this._store.select(getConfirmationPageViewModel);
    registerCredentialsState = RegisterCredentialsState.PasswordOnly;
    registrationCompleted$ = new BehaviorSubject(false);
    isAnnual$ = this._store.select(getRadioInfoForSelectedDeviceViewModel).pipe(
        filter((info) => !!info[0]),
        map((info) => {
            return info?.[0]?.isAnnual;
        })
    );

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
