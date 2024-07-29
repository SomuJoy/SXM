import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UpdateUsecaseWorkflowService } from '@de-care/domains/utility/state-update-usecase';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UpdateUsecaseCanActivateService implements CanActivate {
    constructor(private readonly _updateUsecaseWorkflowService: UpdateUsecaseWorkflowService) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        const useCase = route?.data?.useCaseKey;
        const keepCustomerInfo = route?.data?.keepCustomerInfo;
        if (useCase) {
            return this._updateUsecaseWorkflowService.build({ useCase, keepCustomerInfo }).pipe(
                map((response) => response?.status),
                map((status) => status),
                catchError(() => of(false))
            );
        }
        return of(false);
    }
}
