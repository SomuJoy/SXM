import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';
import { DataAccountSessionInfoService } from '../data-services/data-account-session-info.service';
import { resetAccountSessionInfo, setAccountSessionInfo } from '../state/actions';
import { isQCPostalCode } from '@de-care/data-services';
import { provinceChanged } from '@de-care/domains/customer/state-locale';
import { behaviorEventReactionRflzDeviceInfoVin, behaviorEventReactionUsedCarEligibilityCheckRadioId } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class LoadAccountSessionInfoWorkflowService implements DataWorkflow<null, boolean> {
    constructor(private readonly _dataAccountSessionInfoService: DataAccountSessionInfoService, private readonly _store: Store) {}

    build(): Observable<boolean> {
        return this._dataAccountSessionInfoService.getCustomerDataFromSession().pipe(
            tap((sessionInfo) => {
                this._store.dispatch(resetAccountSessionInfo());
                if (sessionInfo) {
                    this._store.dispatch(setAccountSessionInfo({ sessionInfo }));
                    if (sessionInfo.zipCode && isQCPostalCode(sessionInfo.zipCode)) {
                        this._store.dispatch(provinceChanged({ province: 'QC' }));
                    }
                    const radioIdOrVIN = sessionInfo.radioIdOrVIN || '';
                    if (/\b.{17}\b/.test(radioIdOrVIN)) {
                        this._store.dispatch(behaviorEventReactionRflzDeviceInfoVin({ vin: radioIdOrVIN }));
                    } else {
                        this._store.dispatch(behaviorEventReactionUsedCarEligibilityCheckRadioId({ radioId: radioIdOrVIN }));
                    }
                }
            }),
            mapTo(true)
        );
    }
}
