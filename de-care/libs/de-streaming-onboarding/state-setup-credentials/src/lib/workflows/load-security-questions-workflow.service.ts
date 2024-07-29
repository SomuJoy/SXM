import { Injectable } from '@angular/core';
import { LoadSecurityQuestionsService } from '@de-care/domains/account/state-security-questions';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadSecurityQuestionsWorkflowService implements DataWorkflow<void, boolean> {
    constructor(private readonly _loadSecurityQuestionsService: LoadSecurityQuestionsService) {}

    build(): Observable<boolean> {
        return this._loadSecurityQuestionsService.build();
    }
}
