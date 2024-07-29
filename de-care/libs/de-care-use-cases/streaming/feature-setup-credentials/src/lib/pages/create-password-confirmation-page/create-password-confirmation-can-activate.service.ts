import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadCreatePasswordConfirmationDataWorkflowService } from '@de-care/de-care-use-cases/streaming/state-setup-credentials';

@Injectable({ providedIn: 'root' })
export class CreatePasswordConfirmationCanActivateService implements CanActivate {
    constructor(private readonly _loadCreatePasswordConfirmationDataWorkflowService: LoadCreatePasswordConfirmationDataWorkflowService) {}

    canActivate(): Observable<boolean> {
        return this._loadCreatePasswordConfirmationDataWorkflowService.build();
    }
}
