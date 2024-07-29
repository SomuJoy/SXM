import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, take, withLatestFrom, filter, tap } from 'rxjs/operators';
import { FetchPartnerInfoService } from './../data-services/fetch-partner-info.service';
import { fallBackCorpIdLoaded, loadPartnerInfo, partnerInfoLoaded } from './actions';
import { getIsInitialized, getPartnerInfoList } from './selectors';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { PartnerDetails } from './models';
import { partnerInfoTranslationPrefix } from './constants';

@Injectable({
    providedIn: 'root'
})
export class PartnerInfoEffects {
    constructor(
        private readonly _actions$: Actions,
        private readonly _fetchPartnerInfoService: FetchPartnerInfoService,
        private readonly _store: Store,
        private readonly _translateService: TranslateService
    ) {}

    loadPartnerInfo$ = createEffect(() => {
        return this._actions$.pipe(
            ofType(loadPartnerInfo),
            take(1),
            withLatestFrom(this._store.pipe(select(getIsInitialized))),
            filter(isInitialized => !isInitialized),
            concatMap(() => this._fetchPartnerInfoService.fetch()),
            concatMap(partnerInfo => [partnerInfoLoaded({ partners: partnerInfo.partnerInfo }), fallBackCorpIdLoaded({ fallbackCorpId: partnerInfo.fallbackCorpId || null })])
        );
    });

    translatePartnerInfo$ = createEffect(
        () => {
            return this._actions$.pipe(
                ofType(partnerInfoLoaded),
                withLatestFrom(this._store.pipe(select(getPartnerInfoList))),
                tap(([_, partnerInfoList]) => {
                    partnerInfoList.forEach(partnerInfo => {
                        this._setPartnerValuesForLang(partnerInfo.corpId, partnerInfo.partnerInfo['en-US'], 'en-US');
                        this._setPartnerValuesForLang(partnerInfo.corpId, partnerInfo.partnerInfo['en-CA'], 'en-CA');
                        this._setPartnerValuesForLang(partnerInfo.corpId, partnerInfo.partnerInfo['fr-CA'], 'fr-CA');
                    });
                })
            );
        },
        { dispatch: false }
    );

    private _getTranslationObj(corpId: number, partnerInfo: PartnerDetails) {
        const partnerPayload = {
            [corpId]: {
                IMAGE_SRC: partnerInfo.imageURL,
                LINK: partnerInfo.link,
                ALT_TEXT: partnerInfo.imageAlt,
                NAME: partnerInfo.name
            }
        };

        return partnerInfoTranslationPrefix
            .split('.')
            .reverse()
            .reduce((accum, segment) => {
                return {
                    [segment]: accum
                };
            }, partnerPayload);
    }

    private _setPartnerValuesForLang(corpId: number, partnerInfo: PartnerDetails, lang: string) {
        this._translateService.setTranslation(lang, this._getTranslationObj(corpId, partnerInfo), true);
    }
}
