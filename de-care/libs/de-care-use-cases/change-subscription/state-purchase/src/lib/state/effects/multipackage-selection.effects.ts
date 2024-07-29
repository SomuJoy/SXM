import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { initMultiPackageSelection, setCurrentAudioPackageAsSelectedPlanCode, setPlanCode } from '../actions';
import { withLatestFrom, map } from 'rxjs/operators';
import { getAllPackagesNames } from '../selectors/package-selection.selectors';
import { behaviorEventReactionForPackageNamesPresented } from '@de-care/shared/state-behavior-events';
import { getOffersBasedOnCurrentPlan } from '../selectors/state.selectors';

@Injectable()
export class MultiPackageSelectionEffects {
    initMultiPackageSelection$ = createEffect(() =>
        this._actions$.pipe(
            ofType(initMultiPackageSelection),
            withLatestFrom(this._store.pipe(select(getAllPackagesNames))),
            map(([, packages]) =>
                behaviorEventReactionForPackageNamesPresented({
                    packages
                })
            )
        )
    );

    setCurrentAudioPackageAsSelectedPlanCode$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setCurrentAudioPackageAsSelectedPlanCode),
            withLatestFrom(this._store.select(getOffersBasedOnCurrentPlan)),
            map(([, currentOffersBasedOnCurrentPlan]) => {
                const currentPlan = currentOffersBasedOnCurrentPlan.find(offer => offer.termLength === 1);
                return setPlanCode({ planCode: currentPlan?.planCode || null });
            })
        )
    );

    constructor(private _actions$: Actions, private _store: Store) {}
}
