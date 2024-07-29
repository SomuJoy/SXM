import { Injectable } from '@angular/core';
import { behaviorEventErrorFromHttpCall, behaviorEventReactionCardBinRangesLoaded } from '@de-care/shared/state-behavior-events';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { flatMap, switchMap } from 'rxjs/operators';
import { LoadCardBinRangesWorkflowService } from '../workflows/load-card-bin-ranges-workflow.service';
import { loadCardBinRangesError, setCardBinRanges } from './actions';
import { loadCardBinRanges } from './public.actions';

@Injectable({ providedIn: 'root' })
export class Effects {
    constructor(private readonly _actions$: Actions, private readonly _loadCardBinRangesWorkflowService: LoadCardBinRangesWorkflowService) {}

    load$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(loadCardBinRanges),
                switchMap(() => this._loadCardBinRangesWorkflowService.build())
            ),
        { dispatch: false }
    );

    loadError$ = createEffect(() =>
        this._actions$.pipe(
            ofType(loadCardBinRangesError),
            flatMap(({ error }) => [behaviorEventErrorFromHttpCall({ error })])
        )
    );

    set$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setCardBinRanges),
            flatMap(({ cardBinRanges }) => [behaviorEventReactionCardBinRangesLoaded({ binRangeNames: cardBinRanges?.map((binRange) => binRange.name) })])
        )
    );
}
