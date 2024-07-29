import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { select, Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, mergeMap, take, catchError, withLatestFrom, tap } from 'rxjs/operators';
import { getSelectedSelfPaySubscriptionIdFromOAC, getTrialRadioAccountSubscriptionFirstPlanPackageName } from '../state/selectors/state.selectors';
import { LoadAccountAcscWorkflowService, getAccountSCEligibleSubscriptions, getAccountSCEligibleClosedDevices } from '@de-care/domains/account/state-account';
import { ValidateDeviceByRadioIdOrVinWorkflowService, radioIdLike } from '@de-care/domains/device/state-device-validate';
import { setTrialRadioAccount, setFullTrialRadioId, setEligibilityStatus } from '../state/actions';
import { behaviorEventReactionAcscTrialPackageName, behaviorEventReactionAcscNumberOfScEligibleDevices } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class RadioLookupWorkflowService implements DataWorkflow<string, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _validateDeviceByRadioIdOrVinWorkflowService: ValidateDeviceByRadioIdOrVinWorkflowService,
        private readonly _loadAccountAcscWorkflowService: LoadAccountAcscWorkflowService
    ) {}

    build(identifier: string): Observable<boolean> {
        return this._validateDeviceByRadioIdOrVinWorkflowService.build({ identifier }).pipe(
            take(1),
            withLatestFrom(this._store.pipe(select(getSelectedSelfPaySubscriptionIdFromOAC))),
            concatMap(([response, subscriptionId]) =>
                this._loadAccountAcscWorkflowService.build({ radioId: response.last4DigitsOfRadioId, ...(subscriptionId && { subscriptionId }) }).pipe(
                    tap(() => {
                        if (radioIdLike.test(identifier)) {
                            this._store.dispatch(setFullTrialRadioId({ fullTrialRadioId: identifier }));
                        }
                    }),
                    mergeMap((response) => {
                        this._store.dispatch(setEligibilityStatus({ eligibilityStatus: response.eligibilityStatus }));
                        this._store.dispatch(setTrialRadioAccount({ trialRadioAccount: response.trialAccount }));
                        return of(true);
                    }),
                    catchError((err) => throwError(err))
                )
            ),
            withLatestFrom(
                this._store.pipe(select(getTrialRadioAccountSubscriptionFirstPlanPackageName)),
                this._store.pipe(select(getAccountSCEligibleSubscriptions)),
                this._store.pipe(select(getAccountSCEligibleClosedDevices))
            ),
            mergeMap(([, trialPackageName, sCEligibleSubscriptions, sCEligibleClosedDevices]) => {
                this._store.dispatch(behaviorEventReactionAcscTrialPackageName({ trialPackageName }));
                this._store.dispatch(
                    behaviorEventReactionAcscNumberOfScEligibleDevices({
                        numberScEligibleDevices: sCEligibleSubscriptions.length + sCEligibleClosedDevices.length,
                    })
                );
                return of(true);
            }),
            catchError((err) => {
                if (err.status === 400) {
                    if (err?.error?.error?.fieldErrors?.[0]?.fieldName === 'radioId') {
                        return throwError('validation');
                    } else if (err?.error?.error?.errorCode === 'ACSC_RADIO_IS_CLOSED') {
                        return throwError('closed');
                    } else if (err?.error?.error?.errorCode === 'ACSC_RADIO_IS_ON_SAME_ACCOUNT') {
                        return throwError('sameAccount');
                    }
                }
                return throwError('default');
            })
        );
    }
}
