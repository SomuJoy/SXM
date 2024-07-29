import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DataAccountTokenOnboardingService } from '../data-services/data-account-token-onboarding.service';

@Injectable({ providedIn: 'root' })
export class GetAlcCodeFromAccountTokenInstantStreamWorkflowService implements DataWorkflow<{ token: string }, string> {
    constructor(private readonly _dataAccountTokenOnboardingService: DataAccountTokenOnboardingService) {}

    build({ token }): Observable<string> {
        return this._dataAccountTokenOnboardingService.getAlcCodeFromAccountToken(token).pipe(
            tap(({ alcCode }) => {
                // TODO: add behavior event tracking here if needed.
            }),
            map(({ alcCode }) => alcCode)
        );
    }
}
