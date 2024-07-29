import { Injectable } from '@angular/core';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { concatMap, flatMap, map, take, tap, withLatestFrom } from 'rxjs/operators';
import { collectAllInboundQueryParams, collectPlatformAndSource, processInboundQueryParams } from './actions';
import { Platform, Source } from './reducer';
import { TranslationUrlParserService } from '@de-care/shared/translation';
import { behaviorEventReactionAppPlatform } from '@de-care/shared/state-behavior-events';

@Injectable()
export class LoadInboundQueryParamsEffects {
    private readonly _navigator: Navigator;

    constructor(private readonly _actions$: Actions, private readonly _store: Store, private readonly _translationUrlParserService: TranslationUrlParserService) {
        this._navigator = document?.defaultView?.navigator;
    }

    collectAllQueryParamsAsString$ = createEffect(() =>
        this._actions$.pipe(
            ofType(processInboundQueryParams),
            withLatestFrom(this._store.select(getNormalizedQueryParams)),
            map(([_, inboundQueryParams]) => collectAllInboundQueryParams({ inboundQueryParams }))
        )
    );

    processInboundQueryParams$ = createEffect(() =>
        this._actions$.pipe(
            ofType(processInboundQueryParams),
            concatMap(() =>
                this._store.pipe(
                    select(getNormalizedQueryParams),
                    take(1),
                    tap(({ langpref }) => {
                        if (langpref) {
                            this._translationUrlParserService.setLangFromUrlParam(langpref);
                        }
                    }),
                    map<{ src: string }, Source>(({ src: source }) => {
                        if (source?.match(/everest/i)) {
                            return 'everest';
                        } else {
                            return 'player';
                        }
                    })
                )
            ),
            flatMap((source) => {
                let platform: Platform = 'web';
                if (this._navigator) {
                    const { userAgent } = this._navigator;
                    if (userAgent.match(/Android/i)) {
                        platform = 'android';
                    } else if (userAgent.match(/iPad|iPhone|iPod/i)) {
                        platform = 'ios';
                    }
                }
                return [collectPlatformAndSource({ platform, source }), behaviorEventReactionAppPlatform({ platform })];
            })
        )
    );
}
