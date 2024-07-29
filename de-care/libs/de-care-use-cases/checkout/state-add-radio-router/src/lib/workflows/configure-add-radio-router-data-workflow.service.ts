import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getAccountAccountNumber, LoadAccountWorkflowService } from '@de-care/domains/account/state-account';
import { UpdateUsecaseWorkflowService } from '@de-care/domains/utility/state-update-usecase';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take, tap, withLatestFrom } from 'rxjs/operators';
import { setSelectedRadioId } from '../state/public.actions';
import { getRadioIdFromQueryParams } from '../state/public.selectors';

@Injectable({ providedIn: 'root' })
export class ConfigureAddRadioRouterDataWorkflowService implements DataWorkflow<void, any> {
    constructor(
        private readonly _store: Store,
        private readonly _updateUsecaseWorkflowService: UpdateUsecaseWorkflowService,
        private readonly _router: Router,
        private readonly _loadAccountWorkflowService: LoadAccountWorkflowService
    ) {}

    build(): Observable<any> {
        return this._updateUsecaseWorkflowService.build({ useCase: 'ADD_RADIO', identifiedUser: true }).pipe(
            withLatestFrom(this._store.select(getRadioIdFromQueryParams).pipe(take(1))),
            tap(([, radioid]) => {
                const routerStateData = this._router.getCurrentNavigation()?.extras?.state;
                if (routerStateData?.radioId) {
                    this._store.dispatch(setSelectedRadioId({ radioId: routerStateData.radioId.substr(-4, 4) }));
                } else if (radioid) {
                    this._store.dispatch(setSelectedRadioId({ radioId: radioid.substr(-4, 4) }));
                }
            }),
            withLatestFrom(this._store.select(getAccountAccountNumber).pipe(take(1))),
            map(([, accountNumber]) => {
                if (!accountNumber) {
                    this._loadAccountWorkflowService.build({}).subscribe();
                }
            })
        );
    }
}
