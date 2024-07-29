import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { GetCountryCodeFromCurrentIpWorkflowService } from '@de-care/domains/utility/state-ip-location';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GetCountryCodeFromCurrentIpLocationWorkflowService implements DataWorkflow<void, string> {
    constructor(private readonly _getCountryCodeFromCurrentIpWorkflowService: GetCountryCodeFromCurrentIpWorkflowService) {}

    build(): Observable<any> {
        return this._getCountryCodeFromCurrentIpWorkflowService.build().pipe(
            map((data) => {
                if (data.countryCode === 'CA') {
                    return true;
                }
                return false;
            })
        );
    }
}
