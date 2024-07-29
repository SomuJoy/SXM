import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoadAllPackageDescriptionsWorkflowService } from '@de-care/domains/offers/state-package-descriptions';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoadPackageDescriptionsCanActivateService implements CanActivate {
    constructor(private readonly _loadAllPackageDescriptionsWorkflowService: LoadAllPackageDescriptionsWorkflowService, private readonly _router: Router) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this._loadAllPackageDescriptionsWorkflowService.build().pipe(catchError(() => of(this._router.createUrlTree(['/error']))));
    }
}
