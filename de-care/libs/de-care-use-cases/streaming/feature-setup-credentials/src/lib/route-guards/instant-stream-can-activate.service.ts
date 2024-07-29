import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { GetInstantStreamRedirectUrlWorkflowError, GetInstantStreamRedirectUrlWorkflowService } from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class InstantStreamCanActivateService implements CanActivate {
    private _location: Location;
    constructor(
        private readonly _getInstantStreamRedirectUrlWorkflowService: GetInstantStreamRedirectUrlWorkflowService,
        @Inject(DOCUMENT) readonly document: Document,
        private readonly _router: Router
    ) {
        this._location = document?.defaultView?.location;
    }

    canActivate(): Observable<boolean | UrlTree> {
        return this._getInstantStreamRedirectUrlWorkflowService.build().pipe(
            map((url) => {
                this._location.href = url;
                return false;
            }),
            catchError((error: GetInstantStreamRedirectUrlWorkflowError) => {
                switch (error) {
                    case 'NO_TOKEN': {
                        return of(this._router.createUrlTree(['error']));
                    }
                    default: {
                        return of(this._router.createUrlTree(['error']));
                    }
                }
            })
        );
    }
}
