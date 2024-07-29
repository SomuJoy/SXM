import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { setEnvironmentInfo } from './actions';
import { CookieService } from 'ngx-cookie-service';
import { behaviorEventReactionForSessionId } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class SessionIdEffect {
    constructor(private readonly _actions: Actions, private _cookieService: CookieService) {}

    effect$ = createEffect(() =>
        this._actions.pipe(
            ofType(setEnvironmentInfo),
            tap(({ environmentInfo }) => {
                this._cookieService.set('JSESSIONID', environmentInfo.sessionInfo.id);
            }),
            map(({ environmentInfo }) => behaviorEventReactionForSessionId({ sessionId: environmentInfo.sessionInfo.id }))
        )
    );
}
