import { Injectable } from '@angular/core';
import {
    behaviorEventErrorFromAppCode,
    behaviorEventErrorFromBusinessLogic,
    behaviorEventErrorFromSystem,
    behaviorEventErrorTypeInfo,
    behaviorEventErrorTypeWarn,
} from '@de-care/shared/state-behavior-events';
import { selectUrl } from '@de-care/shared/state-router-store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, map, withLatestFrom } from 'rxjs/operators';
import { logMessage } from './actions';
import { DataLogMessageService } from './data-services/data-log-message.service';

@Injectable({ providedIn: 'root' })
export class Effects {
    constructor(private readonly _actions$: Actions, private readonly _store: Store, private readonly _dataLogMessageService: DataLogMessageService) {}

    businessLogicErrors$ = createEffect(() =>
        this._actions$.pipe(
            ofType(behaviorEventErrorFromBusinessLogic),
            withLatestFrom(this._store.select(selectUrl)),
            map(([{ message, stacktrace }, url]) =>
                logMessage({
                    message,
                    ...(stacktrace ? { stacktrace } : {}),
                    url,
                    logLevel: 'INFO',
                })
            )
        )
    );

    systemErrors$ = createEffect(() =>
        this._actions$.pipe(
            ofType(behaviorEventErrorFromSystem),
            withLatestFrom(this._store.select(selectUrl)),
            map(([{ message, stacktrace }, url]) =>
                logMessage({
                    message,
                    ...(stacktrace ? { stacktrace } : {}),
                    url,
                    logLevel: 'ERROR',
                })
            )
        )
    );

    appError$ = createEffect(() =>
        this._actions$.pipe(
            ofType(behaviorEventErrorFromAppCode),
            map(({ error }) => {
                if (error instanceof Error) {
                    return {
                        message: error.message,
                        stacktrace: error.stack,
                    };
                } else {
                    return { message: error };
                }
            }),
            withLatestFrom(this._store.select(selectUrl)),
            map(([{ message, stacktrace }, url]) =>
                logMessage({
                    message,
                    ...(stacktrace ? { stacktrace } : {}),
                    url,
                    logLevel: 'ERROR',
                })
            )
        )
    );

    infoLogLevels$ = createEffect(() =>
        this._actions$.pipe(
            ofType(behaviorEventErrorTypeInfo),
            withLatestFrom(this._store.select(selectUrl)),
            map(([{ message, stacktrace }, url]) =>
                logMessage({
                    message,
                    ...(stacktrace ? { stacktrace } : {}),
                    url,
                    logLevel: 'INFO',
                })
            )
        )
    );

    warnLogLevels$ = createEffect(() =>
        this._actions$.pipe(
            ofType(behaviorEventErrorTypeWarn),
            withLatestFrom(this._store.select(selectUrl)),
            map(([{ message, stacktrace }, url]) =>
                logMessage({
                    message,
                    ...(stacktrace ? { stacktrace } : {}),
                    url,
                    logLevel: 'WARN',
                })
            )
        )
    );

    logToService$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(logMessage),
                // remove the type property from the model and just pass along the other props
                map((actionData) => ({ ...actionData, type: undefined })),
                concatMap((request) => this._dataLogMessageService.logMessage(request))
            ),
        { dispatch: false }
    );
}
