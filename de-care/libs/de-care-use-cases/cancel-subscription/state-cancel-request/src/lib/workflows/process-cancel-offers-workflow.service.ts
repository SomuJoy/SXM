import { Inject, Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { map, take, concatMap, catchError, withLatestFrom, tap } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store, select } from '@ngrx/store';
import { getCancelOffersRequest, getCancelOfferGridFlagValue } from '../state/selectors/public.selectors';
import { Router } from '@angular/router';
import { getCancelOnly } from '../state/selectors/state.selectors';
import { getFirstAccountSubscriptionFirstPlan } from '@de-care/domains/account/state-account';
import { setPlanCode } from '../state/actions';
import { LoadCancelOffersWorkflowService } from '@de-care/domains/offers/state-offers';
import { behaviorEventErrorFromSystem } from '@de-care/shared/state-behavior-events';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

@Injectable({ providedIn: 'root' })
export class ProcessCancelOffersWorkflowService implements DataWorkflow<null, boolean> {
    constructor(
        private readonly _loadCancelOffersWorkflowService: LoadCancelOffersWorkflowService,
        private readonly _store: Store,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken
    ) {}

    build(): Observable<boolean> {
        return this._store.pipe(
            select(getCancelOffersRequest),
            withLatestFrom(this._store.pipe(select(getCancelOnly))),
            take(1),
            concatMap(([{ subscriptionId, cancelReason }, cancelOnly]) => {
                if (cancelOnly) {
                    return of(true);
                } else {
                    return this._loadCancelOffersWorkflowService.build({ subscriptionId, cancelReason }).pipe(
                        withLatestFrom(this._store.pipe(select(getFirstAccountSubscriptionFirstPlan)), this._store.pipe(select(getCancelOfferGridFlagValue))),
                        tap(([, currPlan, gridFlag]) => {
                            // preselecting current plan if grid is being shown
                            if (gridFlag?.flag?.grid) {
                                this._store.dispatch(setPlanCode({ planCode: currPlan.code }));
                            }
                        }),
                        map(() => true),
                        catchError((error) => {
                            if (this._countrySettings.countryCode.toLowerCase() !== 'ca') {
                                this._store.dispatch(behaviorEventErrorFromSystem({ message: 'PEGA error ' + error?.httpStatus, errorCode: error?.error?.errorCode }));
                            } else {
                                this._store.dispatch(behaviorEventErrorFromSystem({ message: 'Service error ' + error?.httpStatus, errorCode: error?.error?.errorCode }));
                            }
                            return throwError(error);
                        })
                    );
                }
            })
        );
    }
}
