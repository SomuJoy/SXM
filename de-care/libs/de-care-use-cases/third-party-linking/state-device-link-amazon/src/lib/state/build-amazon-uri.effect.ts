import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { buildAndSetAmazonUri, setAmazonUri, setRedirectUri } from './actions';
import { select, Store } from '@ngrx/store';
import { flatMap, withLatestFrom } from 'rxjs/operators';
import { getSessionInfoId } from '@de-care/domains/utility/state-environment-info';
import { SettingsService } from '@de-care/settings';
import { buildAmazonLoginUrl } from '@de-care/domains/subscriptions/state-amazon-linking';

@Injectable()
export class BuildAmazonUriEffect {
    constructor(private readonly _actions$: Actions, private readonly _store: Store, private readonly _settingsService: SettingsService) {}

    effect$ = createEffect(() =>
        this._actions$.pipe(
            ofType(buildAndSetAmazonUri),
            withLatestFrom(this._store.pipe(select(getSessionInfoId))),
            flatMap(([{ redirectUri }, sessionId]) => [
                setRedirectUri({ redirectUri }),
                setAmazonUri({
                    amazonUri: buildAmazonLoginUrl(this._settingsService.settings.amzClientId, redirectUri, sessionId)
                })
            ])
        )
    );
}
