import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, map } from 'rxjs/operators';
import {
    behaviorEventReactionForSuccessfulRegistration,
    behaviorEventReactionForFailedRegistration,
    behaviorEventReactionForEligibleForRegistration,
    behaviorEventReactionPlanNamesForRegistration,
} from '@de-care/shared/state-behavior-events';
import { DataTrackerService } from '@de-care/shared/data-tracker';
import { DataLayerService } from '../../../data-layer.service';

@Injectable({ providedIn: 'root' })
export class RegistrationFromSalesFlowEffects {
    constructor(private readonly _actions$: Actions, private readonly _eventTrackService: DataTrackerService, private readonly _dataLayerService: DataLayerService) {}

    registrationSucessful$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionForSuccessfulRegistration),
                tap(() => {
                    this._eventTrackService.trackEvent('successfull-registration', {});
                    this._dataLayerService.eventTrack('account-registered');
                })
            ),
        { dispatch: false }
    );

    registrationFailed$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionForFailedRegistration),
                tap(() => {
                    this._eventTrackService.trackEvent('failed-registration', {});
                    this._dataLayerService.businessErrorTrack({ errorType: 'BUSINESS', errorName: 'account-registration-failure', errorCode: '' });
                })
            ),
        { dispatch: false }
    );

    eligibleForRegistration$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionForEligibleForRegistration),
                tap(() => {
                    this._eventTrackService.trackEvent('present-registration', {});
                })
            ),
        { dispatch: false }
    );

    capturePlanNamesForRegistration$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionPlanNamesForRegistration),
                map((action) => action.planNames),
                tap((planNames) => {
                    this._dataLayerService.eventTrack('registration-plan-names', { planNames });
                })
            ),
        { dispatch: false }
    );
}
