import { Component, OnInit } from '@angular/core';
import {
    getFeatureFlagEnableQuoteSummary,
    getSecurityQuestions,
    pageDataFinishedLoading,
    rolloverVM,
    SubmitAccountRegistrationWorkflowService,
} from '@de-care/de-care-use-cases/student-verification/state-confirm-re-verify';
import { select, Store } from '@ngrx/store';
import { PrintService } from '@de-care/shared/browser-common/window-print';
import { map } from 'rxjs/operators';
import { BehaviorSubject, of } from 'rxjs';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { RegisterCredentialsState } from '@de-care/domains/account/ui-register';

@Component({
    selector: 'de-care-roll-over-complete',
    templateUrl: './roll-over-complete.component.html',
    styleUrls: ['./roll-over-complete.component.scss'],
})
export class RollOverCompleteComponent implements OnInit {
    vm$ = this._store.pipe(
        select(rolloverVM),
        map((vm) => ({
            ...vm,
            registerCredentialState: RegisterCredentialsState.None,
        }))
    );
    enableQuoteSummaryFeatureToggle$ = this._store.pipe(select(getFeatureFlagEnableQuoteSummary));
    registrationCompleted$ = new BehaviorSubject(false);
    securityQuestions$ = this._store.pipe(select(getSecurityQuestions));
    constructor(private _store: Store, private _printService: PrintService, private _submitAccountRegistrationWorkflowService: SubmitAccountRegistrationWorkflowService) {}

    ngOnInit() {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'authentication', componentKey: 'Confirmation' }));
        this._store.dispatch(pageDataFinishedLoading());
    }

    onPrintClick() {
        this._printService.print();
    }

    onRegisterAccount(registerData): void {
        this._submitAccountRegistrationWorkflowService.build(registerData).subscribe({
            next: () => {
                //this._eventTrackingService.track(DataLayerActionEnum.SuccessfullRegistration, { componentName: ComponentNameEnum.<THIS COMPONENT> });
                this.registrationCompleted$.next(true);
            },
            error: (err) => {
                //this._eventTrackingService.track(DataLayerActionEnum.FailedRegistration, { componentName: ComponentNameEnum.<THIS COMPONENT> });
                return of(err);
            },
        });
    }

    onSubmit(): void {
        /* this._dataLayerSrv.sendExplicitEventTrackEvent(DataLayerActionEnum.RegisterClicked, { componentName: ComponentNameEnum.<THIS COMPONENT> }); */
    }
}
