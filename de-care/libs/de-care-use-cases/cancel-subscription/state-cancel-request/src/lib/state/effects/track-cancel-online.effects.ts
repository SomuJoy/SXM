import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { withLatestFrom, concatMap, map, startWith, take } from 'rxjs/operators';
import { trackCancelOnlineRules } from '../actions';
import { getCurrentSubscriptionIsStreamingOnly, getSubscriptionCancelOptions } from '../selectors/public.selectors';
import { TranslateService } from '@ngx-translate/core';
import { behaviorEventReactionCancelOnlineEligibilityInfo } from '@de-care/shared/state-behavior-events';

@Injectable()
export class TrackCancelOnlineEffects {
    constructor(private actions$: Actions, private _store: Store, private readonly _translateService: TranslateService) {}

    private readonly _currentLang$ = this._translateService.onLangChange.pipe(
        map((langInfo) => langInfo.lang),
        startWith(this._translateService.currentLang)
    );

    trackCancelOnlineRulesEffects$ = createEffect(() =>
        this.actions$.pipe(
            ofType(trackCancelOnlineRules),
            map((action) => action.subscriptionId),
            concatMap((subscriptionId) => this._store.select(getSubscriptionCancelOptions(subscriptionId)).pipe(take(1))),
            withLatestFrom(this._store.select(getCurrentSubscriptionIsStreamingOnly), this._currentLang$),
            map(([rules, isStreaming, lang]) => this._mapCancelInfoToTrack(rules, isStreaming, lang))
        )
    );

    private _mapCancelInfoToTrack(rules, isStreaming, lang) {
        const cancelRuleTriggered = this._mapTriggeredRule(rules?.triggeredRuleId);
        const cancelRuleUsed = isStreaming ? '0. Streaming Only' : lang?.toLowerCase() === 'fr-ca' ? '0. Language is French' : cancelRuleTriggered;

        const cancelOnlineEligibility = {
            cancelOnlineEligible: rules?.showCancelOnline || lang?.toLowerCase() === 'fr-ca' || isStreaming,
            cancelRuleTriggered,
            cancelRuleUsed,
        };
        return behaviorEventReactionCancelOnlineEligibilityInfo({ cancelOnlineEligibility });
    }

    private _mapTriggeredRule(triggeredRuleId) {
        switch (+triggeredRuleId) {
            case 1:
                return '1. Met regulatory rules';
            case 2:
                return '2. Service activated before data cutoff date';
            case 3:
                return '3. Address not in regulatory state';
            case 4:
                return '4. No online purchases made';
            case 5:
                return '5. No eligible subscription types';
            case 6:
                return '6. No uncanceled $0 RTP plans';
            case 7:
                return '7. Purchased very recently';
            default:
                return null;
        }
    }
}
