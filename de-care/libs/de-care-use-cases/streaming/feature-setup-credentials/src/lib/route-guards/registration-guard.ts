import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoadSecurityQuestionsWorkflowService, transactionSessionFlepzSubmittedDataExists } from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, take } from 'rxjs/operators';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';

@Injectable()
export class RegistrationGuard implements CanActivate {
    constructor(
        private readonly _store: Store,
        private readonly _loadSecurityQuestionsWorkflowService: LoadSecurityQuestionsWorkflowService,
        private readonly _router: Router
    ) {}

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<boolean | UrlTree> {
        const baseUrl = routerStateSnapshot.url.split(activatedRouteSnapshot.url[0].path)[0];
        const errorRoute$ = of(this._router.createUrlTree([`${baseUrl}setup-credentials`]));

        this._store.dispatch(pageDataFinishedLoading());
        return this._store.pipe(
            select(transactionSessionFlepzSubmittedDataExists),
            take(1),
            concatMap((sessionDataExists) => (sessionDataExists ? this._loadSecurityQuestionsWorkflowService.build().pipe(catchError(() => errorRoute$)) : errorRoute$))
        );
    }
}
