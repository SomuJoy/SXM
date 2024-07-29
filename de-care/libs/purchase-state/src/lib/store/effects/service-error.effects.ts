import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { ChangeStep, ServiceError } from '../actions/purchase.actions';

@Injectable()
export class ServiceErrorEffects {
    onServiceError$ = createEffect(() =>
        this._actions$.pipe(
            ofType(ServiceError),
            map(_ => ChangeStep({ payload: 1 }))
        )
    );

    constructor(private _actions$: Actions) {}
}
