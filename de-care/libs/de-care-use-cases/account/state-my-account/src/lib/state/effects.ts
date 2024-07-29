import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { concatMap } from 'rxjs/operators';
import { LoadAlertsWorkflowService } from '../workflows/load-alerts-workflow.service';
import { loadNba } from './actions';

@Injectable({ providedIn: 'root' })
export class Effects {
    constructor(private readonly _actions$: Actions, private readonly _loadAlertsWorkflowService: LoadAlertsWorkflowService) {}

    loadNba$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(loadNba),
                concatMap(() => this._loadAlertsWorkflowService.build())
            ),
        { dispatch: false }
    );
}
