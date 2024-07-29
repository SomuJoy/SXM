import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UpdateEbillEnrollmentRequest, UpdateEbillEnrollmentService } from '../data-services/update-ebill-enrollment.service';

@Injectable({ providedIn: 'root' })
export class UpdateEbillEnrollmentWorkflowService implements DataWorkflow<UpdateEbillEnrollmentRequest, boolean> {
    constructor(private readonly _updateEbillEnrollmentService: UpdateEbillEnrollmentService) {}

    build(data: UpdateEbillEnrollmentRequest): Observable<boolean> {
        return this._updateEbillEnrollmentService.build(data).pipe(map(() => true));
    }
}
