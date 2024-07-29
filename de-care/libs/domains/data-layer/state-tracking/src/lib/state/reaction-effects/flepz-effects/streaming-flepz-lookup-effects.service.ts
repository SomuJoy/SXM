import { Injectable } from '@angular/core';
import {
    behaviorEventReactionStreamingFlepzLookupFailure,
    behaviorEventReactionStreamingFlepzLookupReturnedMultipleAccounts,
    behaviorEventReactionStreamingFlepzLookupReturnedNoAccounts,
    behaviorEventReactionStreamingFlepzLookupReturnedSingleAccount,
    behaviorEventReactionStreamingRadioIdVinLookupReturned
} from '@de-care/shared/state-behavior-events';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { DataLayerService } from '../../../data-layer.service';

//TODO: look at renaming this file to be more about any lookup in streaming flow
@Injectable({ providedIn: 'root' })
export class StreamingFlepzLookupEffectsService {
    constructor(private readonly _actions$: Actions, private readonly _dataLayerService: DataLayerService) {}

    streamingFlepzLookupFailure$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionStreamingFlepzLookupFailure),
                tap(({ error }) => {
                    this._dataLayerService.systemErrorTrack({ errorType: 'SYSTEM', errorName: 'System Error', errorCode: error?.error?.errorCode });
                })
            ),
        { dispatch: false }
    );

    streamingFlepzLookupReturnedNoAccounts$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionStreamingFlepzLookupReturnedNoAccounts),
                tap(() => this._trackFlepzAccountLookup())
            ),
        { dispatch: false }
    );

    streamingFlepzLookupReturned$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionStreamingFlepzLookupReturnedSingleAccount, behaviorEventReactionStreamingFlepzLookupReturnedMultipleAccounts),
                tap(({ subscriptions }) => this._trackFlepzAccountLookup(subscriptions))
            ),
        { dispatch: false }
    );

    streamingRadioIdVinLookupReturned$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionStreamingRadioIdVinLookupReturned),
                tap(({ subscriptions }) => this._trackRadioIdVinAccountLookup(subscriptions))
            ),
        { dispatch: false }
    );

    private _trackFlepzAccountLookup(subscriptions = []): void {
        this._trackAccountLookup(subscriptions, 'FLEPZ');
    }

    private _trackRadioIdVinAccountLookup(subscriptions = []): void {
        this._trackAccountLookup(subscriptions, 'RID_VIN');
    }

    private _trackAccountLookup(subscriptions = [], lookupMethod: 'FLEPZ' | 'RID_VIN'): void {
        this._dataLayerService.eventTrack('streaming-account-lookup', {
            accountInfo: { subscriptions, lookupMethod }
        });
    }
}
