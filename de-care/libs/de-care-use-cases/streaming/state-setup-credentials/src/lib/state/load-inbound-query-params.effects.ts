import { Injectable } from '@angular/core';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { TranslationUrlParserService } from '@de-care/shared/translation';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { collectAllInboundQueryParams } from './actions';
import { processInboundQueryParams } from './public.actions';

@Injectable()
export class LoadInboundQueryParamsEffects {
    constructor(private readonly _actions$: Actions, private readonly _store: Store, private readonly _translationUrlParserService: TranslationUrlParserService) {}

    collectAllQueryParamsAsString$ = createEffect(() =>
        this._actions$.pipe(
            ofType(processInboundQueryParams),
            withLatestFrom(this._store.select(getNormalizedQueryParams)),
            tap(([, { langpref }]) => {
                if (langpref) {
                    this._translationUrlParserService.setLangFromUrlParam(langpref);
                }
            }),
            map(([_, inboundQueryParams]) => collectAllInboundQueryParams({ inboundQueryParams }))
        )
    );
}
