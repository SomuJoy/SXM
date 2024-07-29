import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { InfoCustomerCollectionWorkflowService } from '@de-care/de-care-use-cases/account/state-info-customer-collection';

@Injectable({ providedIn: 'root' })
export class CustomerInfoCollectionCanActivate implements CanActivate {
    constructor(private readonly _infoCustomerCollectionWorkflowService: InfoCustomerCollectionWorkflowService) {}

    canActivate(): Observable<boolean> {
        return this._infoCustomerCollectionWorkflowService.build();
    }
}
