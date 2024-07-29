import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { NgxFeatureToggleCanActivateGuard } from 'ngx-feature-toggle';

/**
 * We need to wrap NgxFeatureToggleCanActivateGuard because ot returns true/false.
 * This results in a redirect to the root level path and then a hang if the check fails.
 * We can extend this wrapper to redirect to a specific place on failure but right now it's the global error page.
 */
@Injectable({ providedIn: 'root' })
export class FeatureFlagCanActivateGuardService implements CanActivate {
    constructor(private _router: Router, private readonly _ngxFeatureToggleCanActivateGuard: NgxFeatureToggleCanActivateGuard) {}

    canActivate(route: ActivatedRouteSnapshot) {
        return this._ngxFeatureToggleCanActivateGuard.canActivate(route) ? true : this._goToError();
    }

    private _goToError(): UrlTree {
        return this._router.createUrlTree(['error']);
    }
}
