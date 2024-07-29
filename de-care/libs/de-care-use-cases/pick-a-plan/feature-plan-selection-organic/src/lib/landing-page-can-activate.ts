import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoadOrganicPickAPlanWorkflowService } from '@de-care/de-care-use-cases/pick-a-plan/state-plan-selection-organic';

@Injectable({ providedIn: 'root' })
export class LandingPageCanActivate implements CanActivate {
    constructor(private readonly _router: Router, private readonly _loadOrganicPickAPlanWorkflowService: LoadOrganicPickAPlanWorkflowService) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        return this._loadOrganicPickAPlanWorkflowService.build().pipe(catchError(() => this._redirectToCheckout()));
    }

    private _redirectToCheckout(): Observable<UrlTree> {
        return of(this._router.createUrlTree(['/subscribe/checkout']));
    }
}
