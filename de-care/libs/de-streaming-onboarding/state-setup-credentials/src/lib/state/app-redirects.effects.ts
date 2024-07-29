import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { doRedirectForAndroid, doRedirectForIOS, doRedirectForNativeApp, openPrivacyPolicyViaWindowOpen, unsupportedPlatformForRedirect } from './actions';
import { backToSignInOverlay, backToWelcome, openPrivacyPolicyOverlay } from './public.actions';
import { selectPlatform, selectRedirectRequestPayloadForSignIn, selectRedirectResponsePayloadForPreview, selectRequestPayloadForOpenPrivacyPolicy } from './selectors';
import { getIsCanadaMode } from '@de-care/shared/state-settings';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class AppRedirectsEffects {
    private readonly _window: Window;
    private readonly _location: Location;

    constructor(
        private readonly _actions$: Actions,
        private readonly _store: Store,
        @Inject(DOCUMENT) document: Document,
        private readonly _translateService: TranslateService
    ) {
        this._window = document?.defaultView;
        this._location = this._window?.location;
    }

    redirectToPreview$ = createEffect(() =>
        this._actions$.pipe(
            ofType(backToWelcome),
            withLatestFrom(this._store.pipe(select(selectRedirectResponsePayloadForPreview))),
            map(([_, response]) => doRedirectForNativeApp({ response }))
        )
    );

    redirectToSignIn$ = createEffect(() =>
        this._actions$.pipe(
            ofType(backToSignInOverlay),
            withLatestFrom(this._store.pipe(select(selectRedirectRequestPayloadForSignIn))),
            map(([_, response]) => doRedirectForNativeApp({ response }))
        )
    );

    openPrivacyPolicy$ = createEffect(() =>
        this._actions$.pipe(
            ofType(openPrivacyPolicyOverlay),
            withLatestFrom(this._store.pipe(select(selectRequestPayloadForOpenPrivacyPolicy)), this._store.pipe(select(selectPlatform))),
            map(([_, response, platform]) => (response && platform === 'ios' ? doRedirectForIOS({ response: JSON.stringify(response) }) : openPrivacyPolicyViaWindowOpen()))
        )
    );

    openPrivacyPolicyViaWindowOpen$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(openPrivacyPolicyViaWindowOpen),
                withLatestFrom(this._store.pipe(select(getIsCanadaMode))),
                tap(([, canadaMode]) => {
                    let url;
                    if (canadaMode) {
                        if (this._translateService.currentLang === 'fr-CA') {
                            url = 'https://www.siriusxm.ca/vieprivee';
                        } else {
                            url = 'https://www.siriusxm.ca/privacy';
                        }
                    } else {
                        url = 'https://www.siriusxm.com/privacy-policy';
                    }
                    this._window.open(url);
                })
            ),
        { dispatch: false }
    );

    doRedirectForNativeApp$ = createEffect(() =>
        this._actions$.pipe(
            ofType(doRedirectForNativeApp),
            map(({ response }) => JSON.stringify(response)),
            withLatestFrom(this._store.pipe(select(selectPlatform))),
            map(([response, platform]) => {
                if (platform === 'ios') {
                    return doRedirectForIOS({ response });
                } else if (platform === 'android') {
                    return doRedirectForAndroid({ response });
                }
                return unsupportedPlatformForRedirect({ platform });
            })
        )
    );

    redirectForIOS$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(doRedirectForIOS),
                tap(({ response }) => {
                    this._location.href = `ios:${response}`;
                })
            ),
        { dispatch: false }
    );

    redirectForAndroid$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(doRedirectForAndroid),
                tap(({ response }) => {
                    if (this._window['AndroidFunction']) {
                        this._window['AndroidFunction'].handleMessageFromContent(response);
                    }
                })
            ),
        { dispatch: false }
    );
}
