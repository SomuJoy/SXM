import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { set } from 'feature-toggle-service';
import { map } from 'rxjs/operators';
import { setFeatureFlags } from './actions';
import { featureFlagMapOverrides, FeatureFlagsInApp, FeatureFlagsInConfig, mapLooseTrue } from './models';
import { loadFeatureFlags } from './public.actions';

@Injectable({
    providedIn: 'root'
})
export class FeatureFlagEffects {
    constructor(private readonly _actions$: Actions) {}

    /**
     * We need to set the flags as booleans in feature-toggle-service, which ngx-feature-flag uses under the hood
     */
    setFeatureFlagsInVendor$ = createEffect(() => {
        return this._actions$.pipe(
            ofType(loadFeatureFlags),
            map(action => {
                const featureFlagConfig = this._parseFeatureFlags(action.flags);

                // Manually set in feature-toggle-service
                set(featureFlagConfig);

                // Update our store too
                return setFeatureFlags({ flags: featureFlagConfig });
            })
        );
    });

    /**
     * This lets us map over the feature flag keys and convert to boolean values.
     * There is a rudimentary ability to override the check but we should stick to conventions (`true`).
     * @param flags feature flags mapped to string ('true' recommended)
     */
    private _parseFeatureFlags(flags: FeatureFlagsInConfig) {
        const flagConfig = Object.keys(flags).reduce((accum: FeatureFlagsInApp, key) => {
            const mapOverrideFn = featureFlagMapOverrides[key];
            const k = flags[key];

            if (mapOverrideFn) {
                accum[key] = mapOverrideFn(k);
            } else {
                accum[key] = mapLooseTrue(k);
            }

            return accum;
        }, {} as FeatureFlagsInApp);

        return flagConfig;
    }
}
