import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { LoadSecurityQuestionsWorkflowService, transactionSessionFlepzSubmittedDataExists } from '@de-care/de-streaming-onboarding/state-setup-credentials';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, take } from 'rxjs/operators';

@Injectable()
export class RegistrationGuard implements CanActivate {
    constructor(
        private readonly _store: Store,
        private readonly _loadSecurityQuestionsWorkflowService: LoadSecurityQuestionsWorkflowService,
        private readonly _router: Router
    ) {}

    // TODO: see if we can come up with a way to dynamically get this route path
    //       so we don't need the segment /setup-credentials which is actually set
    //       up in the app routes
    private _errorRoute$ = of(this._router.createUrlTree(['/setup-credentials/find-account']));

    canActivate(): Observable<boolean | UrlTree> {
        return this._store.pipe(
            select(transactionSessionFlepzSubmittedDataExists),
            take(1),
            concatMap(sessionDataExists =>
                sessionDataExists ? this._loadSecurityQuestionsWorkflowService.build().pipe(catchError(() => this._errorRoute$)) : this._errorRoute$
            )
        );
    }
}
