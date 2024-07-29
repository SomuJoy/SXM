import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoadAllPackageDescriptionsWorkflowService } from '@de-care/domains/offers/state-package-descriptions';

@Injectable({ providedIn: 'root' })
export class LoadPackageDescriptionsAsyncCanActivateService implements CanActivate {
    constructor(private readonly _loadAllPackageDescriptionsWorkflowService: LoadAllPackageDescriptionsWorkflowService, private readonly _router: Router) {}

    canActivate(): Observable<boolean | UrlTree> {
        this._loadAllPackageDescriptionsWorkflowService.build().subscribe();
        return of(true);
    }
}
