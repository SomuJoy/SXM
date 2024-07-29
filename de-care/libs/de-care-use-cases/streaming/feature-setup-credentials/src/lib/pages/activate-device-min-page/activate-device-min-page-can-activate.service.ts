import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { concatMap, map, take } from 'rxjs/operators';
import { LoadEnvironmentInfoWorkflowService } from '@de-care/domains/utility/state-environment-info';
import { setActivationCode, setIsSonosFlow } from '@de-care/de-care-use-cases/streaming/state-setup-credentials';

@Injectable({ providedIn: 'root' })
export class ActivateDeviceMinPageCanActivateService implements CanActivate {
    constructor(
        private readonly _store: Store,
        private readonly _loadEnvironmentInfoWorkflowService: LoadEnvironmentInfoWorkflowService,
        private _router: Router,
        private readonly _activatedRoute: ActivatedRoute
    ) {}

    canActivate(): Observable<boolean> {
        return this._loadEnvironmentInfoWorkflowService.build().pipe(
            concatMap(() =>
                this._store.pipe(
                    select(getNormalizedQueryParams),
                    take(1),
                    map(({ activationcode: activationcode }) => {
                        if (activationcode) {
                            this._store.dispatch(setActivationCode({ deviceActivationCode: activationcode }));
                            this._store.dispatch(setIsSonosFlow({ isSonosFlow: true }));
                            return true;
                        } else {
                            this._router.navigate(['onboarding/activate-device'], { relativeTo: this._activatedRoute });
                        }
                    })
                )
            )
        );
    }
}
