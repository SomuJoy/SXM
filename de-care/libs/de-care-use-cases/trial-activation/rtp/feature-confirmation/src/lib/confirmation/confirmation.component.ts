import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { RegisterDataModel } from '@de-care/data-services';
import { RegisterCredentialsState } from '@de-care/domains/account/ui-register';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { Store, select } from '@ngrx/store';
import { of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { getCanadaorQuebecImportantInformationTranslation, getConfirmationData } from '@de-care/de-care-use-cases/trial-activation/rtp/state-confirmation';
import { RegisterWorkflowService } from '@de-care/domains/account/state-account';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';

@Component({
    selector: 'de-care-trial-activation-rtp-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit, AfterViewInit, OnDestroy {
    radioId: string;
    registerCredentialsState: RegisterCredentialsState = RegisterCredentialsState.PasswordOnly;
    registrationCompleted = false;
    confirmationData$ = this._store.pipe(select(getConfirmationData));
    importantInformationTranslation$ = this._store.select(getCanadaorQuebecImportantInformationTranslation);

    private unsubscribe$: Subject<void> = new Subject();

    constructor(private _store: Store, private readonly _registerWorkFlowService: RegisterWorkflowService) {}

    ngOnInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
    }

    ngAfterViewInit() {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'CHECKOUT', componentKey: 'confirmation' }));
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    onRegisterAccount($event: RegisterDataModel): void {
        const registrationData = $event.userName ? $event : { ...$event };
        this._registerWorkFlowService
            .build({ registrationData })
            .pipe(
                takeUntil(this.unsubscribe$),
                catchError((err) => {
                    // TODO: event tracking
                    return of(err);
                })
            )
            .subscribe((resp) => {
                this.registrationCompleted = resp.status === 'SUCCESS';
            });
    }
}
