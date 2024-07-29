import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoadCreatePasswordDataWorkflowErrors, LoadCreatePasswordDataWorkflowService } from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CreatePasswordCanActivateService implements CanActivate {
    constructor(private readonly _router: Router, private readonly _loadCreatePasswordDataWorkflowService: LoadCreatePasswordDataWorkflowService) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this._loadCreatePasswordDataWorkflowService.build().pipe(
            catchError((error: LoadCreatePasswordDataWorkflowErrors) => {
                if (error === 'SESSION_EXPIRED') {
                    // TODO: determine where we want to send the user if their password update session is expired...
                }
                return of(this._router.createUrlTree(['/error']));
            })
        );
    }
}
