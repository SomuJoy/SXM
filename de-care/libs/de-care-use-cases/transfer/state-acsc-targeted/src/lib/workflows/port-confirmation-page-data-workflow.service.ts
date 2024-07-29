import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { mapTo } from 'rxjs/operators';
import { LoadSecurityQuestionsService } from '@de-care/domains/account/state-security-questions';

@Injectable({ providedIn: 'root' })
export class PortConfirmationPageDataWorkflow implements DataWorkflow<void, void> {
    constructor(private readonly _loadSecurityQuestionsService: LoadSecurityQuestionsService) {}

    build(): Observable<void> {
        return this._loadSecurityQuestionsService.build().pipe(mapTo(null));
    }
}
