import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { CoreLoggerService } from '@de-care/data-layer';
import * as AppRootActions from './actions';
import { Observable } from 'rxjs';

@Injectable()
export class StoreAppRootEffects {
    private _logPrefix: string = '[StoreAppRootEffects]:';

    constructor(private _actions$: Actions, private _router: Router, private readonly _logger: CoreLoggerService) {
        this._logger.debug(`${this._logPrefix} Constructor(). Loading Service.`);
    }

    @Effect({ dispatch: false })
    onSystemError$: Observable<AppRootActions.SystemError> = this._actions$.pipe(
        ofType<AppRootActions.SystemError>(AppRootActions.SYSTEM_ERROR),
        tap(_ => {
            // TODO: add datalayer error logging for action.payload (which is the error object)
            this._router.navigate(['/error']);
        })
    );
}
