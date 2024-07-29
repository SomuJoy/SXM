import { Inject, Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, of } from 'rxjs';
import { SmartLinkUrls, SMART_LINK_URLS } from '@de-care/shared/configuration-tokens-smart-link';

interface WorkflowRequest {
    alcCode: string;
    deeplinkUrl: string;
    useCase: string;
}

@Injectable({ providedIn: 'root' })
export class GetUrlForAlcCodeWorkflowService implements DataWorkflow<WorkflowRequest, string> {
    constructor(@Inject(SMART_LINK_URLS) private readonly _smartLinkUrls: SmartLinkUrls) {}

    build({ alcCode }: WorkflowRequest): Observable<string> {
        return of(`${this._smartLinkUrls.toPlayerAppForInstantStream}?ALC=${alcCode}`);
    }
}
